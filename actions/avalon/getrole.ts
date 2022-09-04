import { GLOBBY } from '../../classes/globby';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
	name: 'getrole',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(BigInt(interaction.channel!.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)!;
		const embed = new EmbedBuilder()
			.setTitle(`Your role: ${lobby.getRole(BigInt(interaction.user.id))}`)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
