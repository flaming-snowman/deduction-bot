import { GLOBBY } from '../classes/globby';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new lobby')
		.setDMPermission(false)
		.addSubcommand(new SlashCommandSubcommandBuilder()
		.setName('avalon')
		.setDescription('Create an Avalon lobby')
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const gid = BigInt(interaction.guildId!);
		const globby = GLOBBY.get(gid);
		let lobbyID: number;
		if(interaction.options.getSubcommand() == 'avalon') {
			lobbyID = globby.addAvalon(BigInt(interaction.user.id));
		} else {
			lobbyID = globby.add(BigInt(interaction.user.id));
		}
		const lobby = globby.get(lobbyID)!;
		
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('join')
					.setLabel('Join')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('leave')
					.setLabel('Leave')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('start')
					.setLabel('Start')
					.setStyle(ButtonStyle.Primary),
			)
		await interaction.reply({ embeds: [lobby.getEmbed('Standard')], components: [row], fetchReply: true })
				.then((msg) => { globby.updateMsgMap(BigInt(msg.id), lobbyID); lobby.setMsg(msg) });
	},
};
