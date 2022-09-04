"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("../../classes/globby");
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'pickmission',
    async execute(interaction) {
        const gid = BigInt(interaction.guildId);
        const globby = globby_1.GLOBBY.get(gid);
        const lobbyID = globby.getFromThread(BigInt(interaction.channel.id));
        if (!lobbyID) {
            await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
            return;
        }
        const lobby = globby.get(lobbyID);
        const result = lobby.pickMission(BigInt(interaction.user.id), interaction.values);
        if (!result) {
            await interaction.reply({ content: "Sorry! It is not your pick.", ephemeral: true });
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Proposed Mission`)
            .setDescription(result)
            .addFields({ name: 'Waiting on votes from:', value: lobby.getNotVoted() })
            .setColor(lobby.mcolor);
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Approve')
            .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
            .setCustomId('reject')
            .setLabel('Reject')
            .setStyle(discord_js_1.ButtonStyle.Danger));
        await interaction.update({ embeds: [interaction.message.embeds[0], embed], components: [row] });
    },
};
