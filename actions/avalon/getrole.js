"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("../../classes/globby");
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'getrole',
    async execute(interaction) {
        const gid = BigInt(interaction.guildId);
        const globby = globby_1.GLOBBY.get(gid);
        const lobbyID = globby.getFromThread(BigInt(interaction.channel.id));
        if (!lobbyID) {
            await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
            return;
        }
        const lobby = globby.get(lobbyID);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Your role: ${lobby.getRole(BigInt(interaction.user.id))}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
