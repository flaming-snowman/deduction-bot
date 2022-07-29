import { SlashCommandBuilder } from '@discordjs/builders';
import { gLobby } from '../classes/clobby'
import { EmbedBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lobbies')
		.setDescription('Display the list of lobbies'),
	async execute(interaction: any) {
		const gid = interaction.guild.id;
		if(!gLobby.has(gid)) {
			gLobby.add(gid);
		}
		const embed = new EmbedBuilder()
			.setTitle("List of Lobbies")
			.setDescription(gLobby.get(gid).list());     
		await interaction.reply({ embeds: [embed] });
	},
};

