import { SlashCommandBuilder } from '@discordjs/builders';
import { gLobby } from '../classes/clobby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new lobby'),
	async execute(interaction: any) {
		const gid = interaction.guild.id;
		const lobbyID = gLobby.get(gid).add(interaction.user.id);
		const embed = new EmbedBuilder()
			.setTitle("New Lobby Created")
			.setDescription(gLobby.get(gid).get(lobbyID)!.desc());    
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('join')
					.setLabel('Join')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('leave')
					.setLabel('Leave')
					.setStyle(ButtonStyle.Danger),
			)
		await interaction.reply({ embeds: [embed], components: [row] });
	},
};
