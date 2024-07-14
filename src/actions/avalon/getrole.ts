import { GLOBBY } from '../../classes/globby';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { Avalon } from '../../classes/avalon';

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
		const lobby = globby.get(lobbyID!)! as Avalon;
		const uid = BigInt(interaction.user.id);
		const embed = new EmbedBuilder()
			.setTitle(`Your role: ${lobby.getRole(uid)}`)
			.setDescription(lobby.getRoleDesc(uid));
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
