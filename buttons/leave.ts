import { ButtonInteraction } from 'discord.js';

module.exports = {
	name: 'leave',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.buttons.get('join').execute(interaction, false);
	},
};
