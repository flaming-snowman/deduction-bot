import { GLOBBY } from '../../classes/globby';
import { Avalon } from '../../classes/avalon';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ActionRow, ButtonStyle, SelectMenuInteraction } from 'discord.js';

module.exports = {
	name: 'pickmission',
	async execute(interaction: SelectMenuInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(BigInt(interaction.channel!.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)! as Avalon;

		const result = lobby.pickMission(BigInt(interaction.user.id), interaction.values);

		if(!result) {
			await interaction.reply({ content: "Sorry! It is not your pick.", ephemeral: true });
			return;
		}
		
		const embed = new EmbedBuilder()
        .setTitle(`Proposed Mission`)
		.setDescription(result)
		.addFields(
			{ name: 'Waiting on votes from:', value: lobby.getNotVoted() },
		);

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
			.setCustomId('approve')
			.setLabel('Approve')
			.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
			.setCustomId('reject')
			.setLabel('Reject')
			.setStyle(ButtonStyle.Danger)
		);


		await interaction.update({ embeds: [interaction.message.embeds[0], embed], components: [row] });
	},
};
