import { SlashCommandBuilder } from '@discordjs/builders';
import { gLobby } from '../classes/clobby'
import { MessageEmbed } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lobbies')
		.setDescription('Display the list of lobbies'),
	async execute(interaction) {
		const gid = interaction.guild.id;
		if(!gLobby.globbies.has(gid)) {
			gLobby.add(gid);
		}
		const embed = new MessageEmbed()
			.setTitle("List of Lobbies")
			.setDescription(gLobby.globbies.get(gid).list());     
		await interaction.reply({ embeds: [embed] });
	},
};

