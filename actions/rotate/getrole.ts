import { Helper } from './helper';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputComponent, TextInputStyle } from 'discord.js';

module.exports = {
	name: 'rot_getrole',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const tid = BigInt(interaction.channel!.id);
		const lobby = Helper.getLobbyFromThread(gid, tid);
		if(lobby === null) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}

		const uid = BigInt(interaction.user.id);
		const embed = new EmbedBuilder()
			.setTitle(`Your role: ${lobby.game.getRole(uid)}`)
			.setDescription(lobby.game.getRoleDesc(uid));
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
