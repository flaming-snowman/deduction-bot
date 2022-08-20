import { GLOBBY } from '../../classes/globby';
import { EmbedBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle } from 'discord.js';
import { Avalon } from '../../classes/avalon';

module.exports = {
	name: 'fail',
	async execute(interaction: ButtonInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(BigInt(interaction.channel!.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)! as Avalon;

		const result = lobby.voteEmbark(BigInt(interaction.user.id), true);

		if(result == 2) {
			await interaction.reply({ content: "Sorry! You have already voted.", ephemeral: true });
			return;
		}
		
		if(result == 1) {
			await interaction.reply({ content: "Sorry! You are not on the mission.", ephemeral: true });
			return;
		}

		if(result == 0) {
			const embed = new EmbedBuilder(interaction.message.embeds[0].toJSON())
				.setFields(
					{ name: 'Waiting on votes from:', value: lobby.getEmbarkNotVoted() },
				);

			await interaction.message.edit({ embeds: [embed], components: [interaction.message.components[0]] });
			await interaction.reply({ content: "Your vote was recorded.", ephemeral: true });
			return;
		}

		if(result == 3) {
			const embed = new EmbedBuilder(interaction.message.embeds[0].toJSON())
				.setFields(
					{ name: 'Result', value: lobby.embarkResult() },
				);
			await interaction.update({ embeds: [embed], components: [] });

			lobby.embarkFinish();

			return;
		}
	},
};
