import { SlashCommandBuilder } from '@discordjs/builders';
import { GLOBBY } from '../classes/globby'
import { EmbedBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lobbies')
		.setDescription('Display the list of lobbies')
		.setDMPermission(false),
	async execute(interaction: any) {
		const gid = BigInt(interaction.guildId!);
		if(!GLOBBY.has(gid)) {
			GLOBBY.add(gid);
		}
		const embed = new EmbedBuilder()
			.setTitle("List of Lobbies")
			.setDescription(GLOBBY.get(gid).list());     
		await interaction.reply({ embeds: [embed] });
	},
};

