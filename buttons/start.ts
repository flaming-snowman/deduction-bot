import { GLOBBY } from '../classes/globby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle, GuildMember, TextChannel } from 'discord.js';

module.exports = {
	name: 'start',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)!;
		const response = lobby.start(BigInt(interaction.user.id));
		if(response != 0) {
			await interaction.reply({ content: 'Error: Lobby was unable to start', ephemeral: true });
			return;
		}
		const memberCollection = await interaction.guild?.members.fetch({ user: Array.from(lobby.mem, x => String(x)) });
		if(!memberCollection) {
			throw new Error("One or more users not found");
		}
		const members = new Map<bigint, string>();
		for(let [key, value] of memberCollection) {
			members.set(BigInt(key), value.displayName);
		}
		lobby.updateMembers(members);

		const thread = await (interaction.channel as TextChannel).threads.create({
			name: `Lobby ${lobbyID} - ${lobby.name}`,
			autoArchiveDuration: 60,
		})

		const embed = new EmbedBuilder()
		.setTitle("Lobby started")
		.setURL(thread.url)
		.setDescription(lobby!.desc());

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('join')
				.setLabel('Join')
				.setStyle(ButtonStyle.Success)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('leave')
				.setLabel('Leave')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('start')
				.setLabel('Start')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true),
		);

		await interaction.update({ embeds: [embed], components: [row] });
		
		lobby.setup(thread);
	}
};
