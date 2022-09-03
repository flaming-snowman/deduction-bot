import { GLOBBY } from '../classes/globby';
import { ButtonInteraction, EmbedBuilder, Colors } from 'discord.js';

module.exports = {
	name: 'join',
	async execute(interaction: ButtonInteraction, join: boolean = true) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)!;

		if(join) {
			const realjoin = lobby.memberJoin(BigInt(interaction.user.id));
			if(!realjoin) {
				await interaction.reply({ content: "You are already in the lobby", ephemeral: true });
				return;
			}
		} else {
			const realleave = lobby.memberLeave(BigInt(interaction.user.id));
			if(!realleave) {
				await interaction.reply({ content: "You were not in the lobby to begin with", ephemeral: true });
				return;
			}
			if(lobby.mem.size == 0) {
				globby.del(lobbyID);
				const embed = new EmbedBuilder()
				.setTitle(`Lobby ${lobby.id} - ${lobby.name}`)
				.setFields(
					{ name: 'Status', value: 'Abandoned' }
				)
				.setColor(Colors.Red);

				await interaction.update({ embeds: [embed], components: [] });
				return;
			}
		}

		await interaction.update({ embeds: [lobby.getEmbed().addFields({ name: 'Status', value: 'Waiting' })] });
	},
};
