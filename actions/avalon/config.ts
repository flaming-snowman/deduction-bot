import { GLOBBY } from '../../classes/globby';
import { Avalon } from '../../classes/avalon';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';

module.exports = {
	name: 'avaconfig',
	async execute(interaction: SelectMenuInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)! as Avalon;

		const result = lobby.config(BigInt(interaction.user.id), interaction.values);

		if(!result) {
			await interaction.reply({ content: "Error: Only the host may change lobby settings", ephemeral: true });
			return;
		}
		
		const configrow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
			new SelectMenuBuilder()
				.setCustomId('avaconfig')
				.setPlaceholder(`Configure special roles`)
				.setMinValues(0)
				.setMaxValues(8)
				.addOptions(
					{label: 'Merlin', value: 'Merlin', default: interaction.values.indexOf('Merlin') > -1 },
					{label: 'Percival', value: 'Percival', default: interaction.values.indexOf('Percival') > -1 },
					{label: 'Morgana', value: 'Morgana', default: interaction.values.indexOf('Morgana') > -1 },
					{label: 'Assassin', value: 'Assassin', default: interaction.values.indexOf('Assassin') > -1 },
					{label: 'Mordred', value: 'Mordred', default: interaction.values.indexOf('Mordred') > -1 },
					{label: 'Oberon', value: 'Oberon', default: interaction.values.indexOf('Oberon') > -1 },
					{label: 'Tristan', value: 'Tristan', default: interaction.values.indexOf('Tristan') > -1 },
					{label: 'Isolde', value: 'Isolde', default: interaction.values.indexOf('Isolde') > -1 },
				)
		);

		await interaction.update({ embeds: [lobby.getEmbed('Standard')], components: [interaction.message.components[0], configrow] });
	},
};
