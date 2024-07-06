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
		else {
			const action = interaction.client.user_actions.get(interaction.customId);
			console.log(`${interaction.user.tag} in #${interaction.channel.name} used action '${interaction.customId}'.`);

			if (!action) {
				console.error(`No interaction handler for '${interaction.customId}'`);
				return;
			};
			try {
				await action.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};