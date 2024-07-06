import { Helper } from './helper';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputComponent, TextInputStyle } from 'discord.js';

module.exports = {
	name: 'rot_edit',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const mid = BigInt(interaction.message.id);
		const lobby = Helper.getLobby(gid, mid);
		if(lobby === null) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}

        if(!lobby.rconfig.verifyHost(BigInt(interaction.user.id))) {
            await interaction.reply({ content: 'Error: Only the host can edit the lobby', ephemeral: true });
        }
        
        const modal = new ModalBuilder().setCustomId('rot_setup')
                                        .setTitle("Edit Lobby");
        
        const evilsInput = new TextInputBuilder().setCustomId('evils')
                                                .setLabel('Number of Evil Players')
                                                .setMinLength(1)
                                                .setMaxLength(2)
                                                .setRequired(true)
                                                .setValue(String(lobby.rconfig.evils))
                                                .setStyle(TextInputStyle.Short);

        const ballsInput = new TextInputBuilder().setCustomId('balls')
                                                .setLabel('Number of Balls Per Person')
                                                .setMinLength(1)
                                                .setMaxLength(2)
                                                .setRequired(true)
                                                .setValue(String(lobby.rconfig.ballsEach))
                                                .setStyle(TextInputStyle.Short);

        const evilBallsInput = new TextInputBuilder().setCustomId('evilballs')
                                                .setLabel('Number of Evil Balls')
                                                .setMinLength(1)
                                                .setMaxLength(2)
                                                .setRequired(true)
                                                .setValue(String(lobby.rconfig.evilBalls))
                                                .setStyle(TextInputStyle.Short);
        
        const evilWinInput = new TextInputBuilder().setCustomId('evilwin')
                                                .setLabel('Evil Win Threshold')
                                                .setMinLength(1)
                                                .setMaxLength(2)
                                                .setRequired(true)
                                                .setValue(String(lobby.rconfig.evilWinCon))
                                                .setStyle(TextInputStyle.Short);

        const roundsInput = new TextInputBuilder().setCustomId('rounds')
                                                .setLabel('Number of Rounds')
                                                .setMinLength(1)
                                                .setMaxLength(1)
                                                .setRequired(true)
                                                .setValue(String(lobby.rconfig.numRounds))
                                                .setStyle(TextInputStyle.Short);
        
        const inputs = [evilsInput, ballsInput, evilBallsInput, evilWinInput, roundsInput];
        inputs.forEach(x => modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(x)))

        await interaction.showModal(modal);
	},
};
