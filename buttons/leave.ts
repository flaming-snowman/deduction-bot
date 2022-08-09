import { gLobby } from '../classes/clobby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle } from 'discord.js';

module.exports = {
	name: 'leave',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = gLobby.get(gid);
		const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!);
		const realleave = lobby?.memberLeave(BigInt(interaction.user.id));
		if(!realleave) {
			await interaction.reply({ content: "You were not in the lobby to begin with", ephemeral: true });
			return;
		}
		const embed = new EmbedBuilder()
			.setTitle("Lobby Left")
			.setDescription(lobby!.desc());    
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
