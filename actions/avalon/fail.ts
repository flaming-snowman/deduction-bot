import { ButtonInteraction } from "discord.js";

module.exports = {
	name: 'fail',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.user_actions.get('succeed').execute(interaction, true);
	},
};
