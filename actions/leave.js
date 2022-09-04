"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'leave',
    async execute(interaction) {
        // @ts-ignore
        interaction.client.buttons.get('join').execute(interaction, false);
    },
};
