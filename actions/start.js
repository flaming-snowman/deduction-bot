"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("../classes/globby");
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'start',
    async execute(interaction) {
        const gid = BigInt(interaction.guildId);
        const globby = globby_1.GLOBBY.get(gid);
        const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
        if (!lobbyID) {
            await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
            return;
        }
        const lobby = globby.get(lobbyID);
        const response = lobby.start(BigInt(interaction.user.id));
        if (response != 0) {
            if (response == 1) {
                await interaction.reply({ content: 'Error: Only the host may start the lobby', ephemeral: true });
            }
            if (response == 2) {
                await interaction.reply({ content: 'Error: Lobby does not meet the requirements to begin', ephemeral: true });
            }
            return;
        }
        const memberCollection = await interaction.guild?.members.fetch({ user: Array.from(lobby.mem, x => String(x)) });
        if (!memberCollection) {
            throw new Error("One or more users not found");
        }
        const members = new Map();
        for (let [key, value] of memberCollection) {
            members.set(BigInt(key), value.displayName);
        }
        lobby.updateMembers(members);
        const thread = await interaction.channel.threads.create({
            name: `Lobby ${lobbyID} - ${lobby.name}`,
            autoArchiveDuration: 60,
        });
        lobby.setStatus(1);
        const embed = lobby.getEmbed('Standard').setURL(thread.url);
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('join')
            .setLabel('Join')
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setDisabled(true), new discord_js_1.ButtonBuilder()
            .setCustomId('leave')
            .setLabel('Leave')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setDisabled(true), new discord_js_1.ButtonBuilder()
            .setCustomId('start')
            .setLabel('Start')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(true));
        await interaction.update({ embeds: [embed], components: [row] });
        lobby.setup(thread);
    }
};
