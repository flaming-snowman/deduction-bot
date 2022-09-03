import { GLOBBY } from '../../classes/globby';
import { Avalon } from '../../classes/avalon';
import { Colors, EmbedBuilder, SelectMenuInteraction } from 'discord.js';

module.exports = {
	name: 'shoot',
	async execute(interaction: SelectMenuInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(BigInt(interaction.channel!.id));
		if(!lobbyID) {
			await interaction.reply({ content: 'Error: Lobby has expired', ephemeral: true });
			return;
		}
		const lobby = globby.get(lobbyID!)! as Avalon;

		const correct = lobby.endAss(BigInt(interaction.user.id), interaction.values);

		if(correct == null) {
			await interaction.reply({ content: "Sorry! You are not the assassin", ephemeral: true });
			return;
		}
		
		let shot = `<@${interaction.user.id}> shot <@${interaction.values[0]}>`;
		if(interaction.values.length == 2) {
			shot += ` and <@${interaction.values[1]}>`;
		}

		const embed = new EmbedBuilder()
		.setTitle(`Assassination ${correct ? 'Successful' : 'Failed'}`)
		.setDescription(shot)
		.setColor(correct ? Colors.Green : Colors.Red);

		await interaction.update({ embeds: [embed], components: [] });
		
		lobby.finishGame(!correct);
		// res win if shot incorrect
	},
};
