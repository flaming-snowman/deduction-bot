import { Helper } from './helper';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';

module.exports = {
	name: 'rot_roles',
	async execute(interaction: StringSelectMenuInteraction) {
		const gid = BigInt(interaction.guildId!);
		const mid = BigInt(interaction.message.id);
		const lobby = Helper.getLobby(gid, mid);
		if(lobby === null) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}

		const result = lobby.roleConfig(BigInt(interaction.user.id), interaction.values);
		if(result.code != 0) {
			await interaction.reply({ content: result.message, ephemeral: true });
			return;
		}
		
		const configrow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('rot_roles')
				.setPlaceholder(`Configure special roles`)
				.setMinValues(0)
				.setMaxValues(4)
				.addOptions(
					{label: 'Invest', value: 'Invest', default: interaction.values.indexOf('Invest') > -1 },
					{label: 'Mimic', value: 'Mimic', default: interaction.values.indexOf('Mimic') > -1 },
					{label: 'Warden', value: 'Warden', default: interaction.values.indexOf('Warden') > -1 },
					{label: 'Assassin', value: 'Assassin', default: interaction.values.indexOf('Assassin') > -1 },
				)
		);

		await interaction.update({ embeds: [lobby.getEmbed('Standard')], components: [interaction.message.components[0], configrow] });
	},
};
