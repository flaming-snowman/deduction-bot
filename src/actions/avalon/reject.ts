import { ButtonInteraction } from "discord.js";

module.exports = {
	name: 'reject',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.user_actions.get('approve').execute(interaction, false);
	},
};
