// Require the necessary imports
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Retrieve commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandDirs = fs.readdirSync('./commands').filter(dir => fs.statSync(`./commands/${dir}`).isDirectory());
for (const dir of commandDirs) {
	let files = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
	files.forEach(x => commandFiles.push(`${dir}/${x}`));
}
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

// Retrieve actions (buttons, select menus, text input)
client.user_actions = new Collection();
const actionFiles = fs.readdirSync('./actions').filter(file => file.endsWith('.js'));
const actionDirs = fs.readdirSync('./actions').filter(dir => fs.statSync(`./actions/${dir}`).isDirectory());
for (const dir of actionDirs) {
	let files = fs.readdirSync(`./actions/${dir}`).filter(file => file.endsWith('.js'));
	files.forEach(x => actionFiles.push(`${dir}/${x}`));
}
for (const file of actionFiles) {
	const action = require(`./actions/${file}`);
	client.user_actions.set(action.name, action);
}

// Register commands in dev guild
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands. It may take some time for global commands to refresh.');
	}
	catch (error) {
		console.error(error);
	}
})();

// Load event handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with token
client.login(token);