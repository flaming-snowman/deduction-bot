import { SlashCommandBuilder } from '@discordjs/builders';
import { gLobby } from '../classes/clobby'
import { MessageEmbed } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new lobby'),
	async execute(interaction) {
		const gid = interaction.guild.id;
		if(!gLobby.has(gid)) {
			gLobby.add(gid);
		}
		const lobbyID = gLobby.get(gid).add(interaction.user.id);
		const embed = new MessageEmbed()
			.setTitle("New Lobby Created")
			.setDescription(gLobby.get(gid).get(lobbyID).desc());    
		await interaction.reply({ embeds: [embed] });
	},
};
