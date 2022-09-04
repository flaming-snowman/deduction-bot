import { GLOBBY } from '../classes/globby';
import { ActionRow, ActionRowBuilder, ActionRowData, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SelectMenuBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

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

		const joinrow = new ActionRowBuilder<ButtonBuilder>()
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
		);
		// ActionRowBuilder<AnyComponentBuilder> doesn't work due to some cursed inheritance shenanigans
		let rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] = [joinrow];
		if(interaction.options.getSubcommand() == 'avalon') {
			lobbyID = globby.addAvalon(BigInt(interaction.user.id));
			const configrow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new SelectMenuBuilder()
					.setCustomId('avaconfig')
					.setPlaceholder(`Configure special roles`)
					.setMinValues(0)
					.setMaxValues(8)
					.addOptions(
						{label: 'Merlin', value: 'Merlin', default: true},
						{label: 'Percival', value: 'Percival', default: true},
						{label: 'Morgana', value: 'Morgana', default: true},
						{label: 'Assassin', value: 'Assassin', default: true},
						{label: 'Mordred', value: 'Mordred', default: false},
						{label: 'Oberon', value: 'Oberon', default: false},
						{label: 'Tristan', value: 'Tristan', default: false},
						{label: 'Isolde', value: 'Isolde', default: false},
					)
			);
			rows.push(configrow);
		} else {
			lobbyID = globby.add(BigInt(interaction.user.id));
		}
		const lobby = globby.get(lobbyID)!;
		
		await interaction.reply({ embeds: [lobby.getEmbed('Standard')], components: rows, fetchReply: true })
				.then((msg) => { globby.updateMsgMap(BigInt(msg.id), lobbyID); lobby.setMsg(msg) });
	},
};
