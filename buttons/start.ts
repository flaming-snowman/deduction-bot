import { GLOBBY } from '../classes/clobby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle } from 'discord.js';

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
		const lobby = globby.get(lobbyID!);
		const embed = new EmbedBuilder()
			.setTitle("Lobby started")
			.setDescription(lobby!.desc());    
		await interaction.reply({ embeds: [embed] });
	},
};
