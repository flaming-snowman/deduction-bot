import { GLOBBY } from '../../classes/globby';
import { Avalon } from '../../classes/avalon';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
	name: 'approve',
	async execute(interaction: ButtonInteraction, apped = true) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(BigInt(interaction.channel!.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)! as Avalon;

		const result = lobby.voteMission(BigInt(interaction.user.id), apped);

		if(result == 2) {
			await interaction.reply({ content: "Sorry! You have already voted.", ephemeral: true });
			return;
		}
		
		if(result == 1) {
			await interaction.reply({ content: "Sorry! You are not in this game.", ephemeral: true });
			return;
		}

		if(result == 0) {
			const embed = new EmbedBuilder()
				.setTitle(`Proposed Mission`)
				.setDescription(interaction.message.embeds[1].description)
				.addFields(
					{ name: 'Waiting on votes from:', value: lobby.getNotVoted() },
				)
				.setColor(lobby.mcolor);
			await interaction.update({ embeds: [interaction.message.embeds[0], embed], components: [interaction.message.components[0]] });
			/*
			await interaction.message.edit({ embeds: [interaction.message.embeds[0], embed], components: [interaction.message.components[0]] });
			await interaction.reply({ content: "Your vote was recorded.", ephemeral: true });
			*/
			return;
		}

		if(result == 3) {
			const embed = new EmbedBuilder()
				.setTitle(`${lobby.isHammer() ? 'Hammer' : 'Mission'} ${lobby.votePass() ? "Approved" : "Rejected"}`)
				.setDescription(interaction.message.embeds[1].description)
				.addFields(
					{ name: 'Vote results:', value: lobby.voteString() },
				)
				.setColor(lobby.mcolor);
			await interaction.update({ embeds: [interaction.message.embeds[0], embed], components: [] });
			
			if(lobby.votePass()) lobby.embarkMission();
			else {
				lobby.nextMission();
			}
			return;
		}
	},
};
