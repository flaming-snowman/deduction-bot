"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'fail',
    async execute(interaction) {
        // @ts-ignore
        interaction.client.buttons.get('succeed').execute(interaction, true);
    },
};
