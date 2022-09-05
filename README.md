# deduction-bot
A node.js discord bot for hosting and playing social deduction games

# recommended configuration
https://discord.com/api/oauth2/authorize?client_id=1016168930517192814&permissions=309237664768&scope=bot%20applications.commands

If you would like to restrict the commands to a specific (ie bot) channel, you can do so with the following steps: Server Settings -> Integrations -> Manage Deduction Bot -> Scroll up -> Restrict access to 'All Channels' -> Add channel you want commands to be runnable from.


# avalon
Features:
* Lobby creation
* Role setup (Merlin, Percival, Morgana, Assassin, Mordred, Oberon, Tristan, Isolde)
* Mission voting
* Assassination

To do:
* Lady of the Lake

# future plans
* database to store persistent data
* color avalon
* saboset

# known issues
The bot must have the following permissions in the channel in which lobbies are created:
* View Channel
* Send Messages
* Send Messages in Threads
* Create Public Threads
* Embed Links

The bot will not display error messages if it is missing permissions (double check role permissions and channel overrides if you suspect something is wrong).

If the bot crashes at any point and goes offline, please notify me with what steps caused the crash and I will try to fix it.

# compiling and running locally
cmd+shift+B to compile in VSCode

config.json supplies clientId and token

`node index.js` to run in terminal