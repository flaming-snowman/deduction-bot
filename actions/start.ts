import { GLOBBY } from '../classes/globby';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextChannel } from 'discord.js';

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
			if(response == 1) {
				await interaction.reply({ content: 'Error: Only the host may start the lobby', ephemeral: true });
			}
			if(response == 2) {
				await interaction.reply({ content: 'Error: Avalon only supports lobby sizes of 5-10', ephemeral: true });
			}
			if(response == 3) {
				await interaction.reply({ content: 'Error: You have too many special res or spy roles', ephemeral: true });
			}
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

		lobby.setStatus(1);
		const embed = lobby.getEmbed('Standard').setURL(thread.url);

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
