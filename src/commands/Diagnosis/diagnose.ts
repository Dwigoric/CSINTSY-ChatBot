import { ChatInputCommand, Command } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export class DiagnoseCommand extends Command {
	constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: "Starts a diagnosis session.",
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) => {
				builder
					.setName(this.name)
					.setDescription(this.description)
					// Preliminary questions
					.addIntegerOption((option) =>
						option.setName("age").setDescription("The age of the patient to diagnose.").setRequired(true).setMinValue(0).setMaxValue(122)
					)
					.addStringOption((option) =>
						option
							.setName("biological_sex")
							.setDescription("The biological sex of the patient to diagnose.")
							.setRequired(true)
							.setChoices({ name: "M", value: "M" }, { name: "F", value: "F" })
					)
					.addNumberOption((option) =>
						option
							.setName("height")
							.setDescription("The height of the patient to diagnose (in centimeters).")
							.setRequired(true)
							.setMinValue(0)
							.setMaxValue(272)
					)
					.addNumberOption((option) =>
						option
							.setName("weight")
							.setDescription("The weight of the patient to diagnose (in kilograms).")
							.setRequired(true)
							.setMinValue(0)
							.setMaxValue(635)
					)
					.addNumberOption((option) =>
						option
							.setName("body_temperature")
							.setDescription("The body temperature of the patient to diagnose (in degrees Celsius).")
							.setRequired(true)
							.setMinValue(9)
							.setMaxValue(46.5)
					)
					.addIntegerOption((option) =>
						option
							.setName("systolic_blood_pressure")
							.setDescription("If blood pressure (BP) is 120/80, then the systolic BP is 120.")
							.setRequired(true)
							.setMinValue(120)
							.setMaxValue(370)
					)
					.addIntegerOption((option) =>
						option
							.setName("diastolic_blood_pressure")
							.setDescription("If blood pressure (BP) is 120/80, then the diastolic BP is 80.")
							.setRequired(true)
							.setMinValue(30)
							.setMaxValue(360)
					);
			},
			{
				guildIds: [process.env.TEST_GUILD_ID ?? ""],
				idHints: ["1092963801625792512"],
			}
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		if (this.container.client.directory.has(interaction.user.id)) return this.handleExistingSession(interaction);

		const personalData = {
			age: interaction.options.getInteger("age")!,
			biologicalSex: interaction.options.getString("biological_sex")!,
			height: interaction.options.getNumber("height")!,
			weight: interaction.options.getNumber("weight")!,
			bodyTemperature: interaction.options.getNumber("body_temp")!,
			systolicBloodPressure: interaction.options.getInteger("systolic_blood_pressure")!,
			diastolicBloodPressure: interaction.options.getInteger("diastolic_blood_pressure")!,
			history: [],
			accomplishedHistory: false,
			accomplishedLifestyle: false,
			started: false,

			counter: 0,
			indicators: [],
			asked: []
		};

		this.container.client.directory.set(interaction.user.id, personalData);

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder({
				custom_id: "diagnosis:agree",
				label: "I agree",
				emoji: "✅",
				style: ButtonStyle.Success,
			}),
			new ButtonBuilder({
				custom_id: "diagnosis:disagree",
				label: "I disagree",
				emoji: "✖",
				style: ButtonStyle.Danger,
			})
		);

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "Diagnosis Agreement",
					description: [
						"**Agreement**",
						"",
						"By continuing, you agree to the following:",
						"1. This bot is not a medical professional.",
						"2. This bot is not responsible for any harm caused by the diagnosis.",
						"3. Any diagnosis given by this bot is not a substitute for a real diagnosis by a medical professional.",
						"",
						"If you agree to the above, please click the green button below.",
						"Otherwise, please click the red button instead.",
					].join("\n"),
					fields: [
						{
							name: "What about personal data?",
							value: [
								"The data you input, i.e. the data of the patient, will NOT be stored on a persistent database.",
								"Moreover, the data will NOT be shared with any third-party services.",
								"However, the data will be stored in memory for the duration of the diagnosis session.",
							].join(" "),
						},
					],
				}).setColor("Random"),
			],
			components: [actionRow],
			ephemeral: true,
		});
	}

	private async handleExistingSession(interaction: Command.ChatInputCommandInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder({
				custom_id: "diagnosis:existing",
				label: "Delete existing session",
				emoji: "🗑",
				style: ButtonStyle.Danger,
			})
		);

		return interaction.reply({
			content: "You already have an active session. Would you like to delete it?",
			components: [actionRow],
			ephemeral: true,
		});
	}
}
