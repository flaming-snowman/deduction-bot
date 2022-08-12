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
		.addUserOption(option => 
			option.setName('user2')
				.setDescription('User to add')
				.setRequired(false))
		.addUserOption(option => 
			option.setName('user3')
				.setDescription('User to add')
				.setRequired(false))
		.addUserOption(option => 
			option.setName('user4')
				.setDescription('User to add')
				.setRequired(false))
		.addUserOption(option => 
			option.setName('user5')
				.setDescription('User to add')
				.setRequired(false))
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobby = globby.get(interaction.options.getInteger('lobby', true));
		let resp = String(lobby!.memberJoin(BigInt(interaction.options.getUser('user', true).id)));
		for(let i = 2; i <= 5; i++) {
			const user = interaction.options.getUser(`user${i}`, false);
			if(!user) {
				continue;
			}
			resp += ' ' + String(lobby!.memberJoin(BigInt(interaction.options.getUser(`user${i}`)!.id)));
		}
		await interaction.reply({ content: resp });
	},
};

