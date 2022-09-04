"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("../classes/globby");
module.exports = {
    name: 'join',
    async execute(interaction, join = true) {
        const gid = BigInt(interaction.guildId);
        const globby = globby_1.GLOBBY.get(gid);
        const lobbyID = globby.getFromMsg(BigInt(interaction.message.id));
        if (!lobbyID) {
            await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
            return;
        }
        const lobby = globby.get(lobbyID);
        if (join) {
            const realjoin = lobby.memberJoin(BigInt(interaction.user.id));
            if (!realjoin) {
                await interaction.reply({ content: "You are already in the lobby", ephemeral: true });
                return;
            }
        }
        else {
            const realleave = lobby.memberLeave(BigInt(interaction.user.id));
            if (!realleave) {
                await interaction.reply({ content: "You were not in the lobby to begin with", ephemeral: true });
                return;
            }
            if (lobby.mem.size == 0) {
                globby.del(lobbyID);
                await interaction.update({ embeds: [lobby.getEmbed('Abandoned')], components: [] });
                return;
            }
        }
        await interaction.update({ embeds: [lobby.getEmbed('Standard')] });
    },
};
