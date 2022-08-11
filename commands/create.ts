import { SlashCommandBuilder } from '@discordjs/builders';
import { GLOBBY } from '../classes/globby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new lobby'),
	async execute(interaction: ChatInputCommandInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.add(BigInt(interaction.user.id));
		const lobby = globby.get(lobbyID);
		const embed = new EmbedBuilder()
			.setTitle("New Lobby Created")
			.setDescription(lobby!.desc());    
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
				new ButtonBuilder()
					.setCustomId('start')
					.setLabel('Start')
					.setStyle(ButtonStyle.Primary),
			)
		await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
				.then((msg) => globby.updateMsgMap(BigInt(msg.id), lobbyID));
	},
};
