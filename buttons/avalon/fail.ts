import { ButtonInteraction } from "discord.js";

module.exports = {
	name: 'fail',
	async execute(interaction: ButtonInteraction) {
		// @ts-ignore
		interaction.client.buttons.get('succeed').execute(interaction, true);
	},
};
