module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			console.log(`${interaction.user.tag} in #${interaction.channel.name} used command '${interaction.commandName}'.`);

			if (!command) {
				console.error(`No interaction handler for '${interaction.commandName}'`);
				return;
			};
			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		if (interaction.isButton()) {
			const button = interaction.client.buttons.get(interaction.customId);
			console.log(`${interaction.user.tag} in #${interaction.channel.name} used button '${interaction.customId}.'`);

			if (!button) {
				console.error(`No interaction handler for '${interaction.customId}'`);
				return;
			};
			try {
				await button.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};