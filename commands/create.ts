import { SlashCommandBuilder } from '@discordjs/builders';
import { gLobby } from '../classes/clobby';
import { EmbedBuilder } from '@discordjs/builders';

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
		await interaction.reply({ embeds: [embed],});
	},
};
