import { GLOBBY } from '../../classes/globby';
import { Avalon } from '../../classes/avalon';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuInteraction } from 'discord.js';

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
		
		await interaction.update({ embeds: [lobby.getEmbed('Standard')] });
	},
};
