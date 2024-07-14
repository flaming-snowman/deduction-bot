import { Helper } from './helper';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputComponent } from 'discord.js';

module.exports = {
	name: 'rot_setup',
	async execute(interaction: ModalSubmitInteraction) {
		if(!interaction.isFromMessage()) return;
		const gid = BigInt(interaction.guildId!);
		const mid = BigInt(interaction.message.id);
		const lobby = Helper.getLobbyFromMsg(gid, mid);
		if(lobby === null) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const fields = ['evils', 'balls', 'evilballs', 'evilwin', 'rounds'];
		let settingArray: number[] = [];
		fields.forEach(field => { settingArray.push(parseInt(interaction.fields.getTextInputValue(field), 10)); });
		let valid = true;
		settingArray.forEach(setting => { if(isNaN(setting)) valid = false; });
		if(!valid) {
			await interaction.reply({ content: 'Invalid number detected, please try again.', ephemeral: true });
			return;
		}
		lobby.settingConfig(settingArray);
		interaction.update( { embeds: [lobby.getEmbed('Standard')] } );
	},
};
