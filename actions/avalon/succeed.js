"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("../../classes/globby");
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'succeed',
    async execute(interaction, failed = false) {
        const gid = BigInt(interaction.guildId);
        const globby = globby_1.GLOBBY.get(gid);
        const lobbyID = globby.getFromThread(BigInt(interaction.channel.id));
        if (!lobbyID) {
            await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
            return;
        }
        const lobby = globby.get(lobbyID);
        const result = lobby.voteEmbark(BigInt(interaction.user.id), failed);
        if (result == 2) {
            await interaction.reply({ content: "Sorry! You have already voted.", ephemeral: true });
            return;
        }
        if (result == 1) {
            await interaction.reply({ content: "Sorry! You are not on the mission.", ephemeral: true });
            return;
        }
        if (result == 0) {
            const embed = new discord_js_1.EmbedBuilder(interaction.message.embeds[0].toJSON())
                .setFields({ name: 'Waiting on votes from:', value: lobby.getEmbarkNotVoted() })
                .setColor(lobby.mcolor);
            await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
            /*
            await interaction.message.edit({ embeds: [embed], components: [interaction.message.components[0]] });
            await interaction.reply({ content: "Your vote was recorded.", ephemeral: true });
            */
            return;
        }
        if (result == 3) {
            const embed = new discord_js_1.EmbedBuilder(interaction.message.embeds[0].toJSON())
                .setFields({ name: 'Result', value: lobby.embarkResult() })
                .setColor(lobby.mcolor);
            await interaction.update({ embeds: [embed], components: [] });
            lobby.embarkFinish();
            return;
        }
    },
};
