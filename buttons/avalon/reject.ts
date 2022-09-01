import { ButtonInteraction } from "discord.js";

module.exports = {
	name: 'reject',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.buttons.get('approve').execute(interaction, false);
	},
};
