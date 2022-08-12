import { SlashCommandBuilder } from '@discordjs/builders';
import { GLOBBY } from '../classes/globby'
import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Manually add user to lobby')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('User to add')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('lobby')
				.setDescription('lobby id')
				.setRequired(true))
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobby = globby.get(interaction.options.getInteger('lobby', true));
		const resp = lobby!.memberJoin(BigInt(interaction.options.getUser('user', true).id));
		await interaction.reply({ content: String(resp) });
	},
};

