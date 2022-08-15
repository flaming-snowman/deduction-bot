// Require the necessary imports
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

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

// Retrieve buttons
client.buttons = new Collection();
const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
const buttonDirs = fs.readdirSync('./buttons').filter(dir => fs.statSync(`./buttons/${dir}`).isDirectory());
for (const dir of buttonDirs) {
	let files = fs.readdirSync(`./buttons/${dir}`).filter(file => file.endsWith('.js'));
	files.forEach(x => buttonFiles.push(`${dir}/${x}`));
}
for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	client.buttons.set(button.name, button);
}

// Retrieve buttons
client.selectmenus = new Collection();
const selectmenuFiles = fs.readdirSync('./selectmenus').filter(file => file.endsWith('.js'));
const selectmenuDirs = fs.readdirSync('./selectmenus').filter(dir => fs.statSync(`./selectmenus/${dir}`).isDirectory());
for (const dir of selectmenuDirs) {
	let files = fs.readdirSync(`./selectmenus/${dir}`).filter(file => file.endsWith('.js'));
	files.forEach(x => selectmenuFiles.push(`${dir}/${x}`));
}
for (const file of selectmenuFiles) {
	const selectmenu = require(`./selectmenus/${file}`);
	client.selectmenus.set(selectmenu.name, selectmenu);
}

// Register commands in dev guild
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
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