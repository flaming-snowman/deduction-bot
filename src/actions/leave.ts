import { ButtonInteraction } from 'discord.js';

module.exports = {
	name: 'leave',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.user_actions.get('join').execute(interaction, false);
	},
};
