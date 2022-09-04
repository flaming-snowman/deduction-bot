"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'reject',
    async execute(interaction) {
        // @ts-ignore
        interaction.client.buttons.get('approve').execute(interaction, false);
    },
};
