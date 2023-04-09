import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

export class DiagnoseProcessHandler extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu,
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.startsWith("diagnosis:flow")) return this.none();

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		// These are the symptoms selected by the user
		const symptoms = interaction.values.filter(value => value !== "none") as Array<keyof typeof this.container.client.symptomQuestions>;

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.indicators.push(...(symptoms as typeof userDir.indicators));

		const counter = parseInt(interaction.customId.slice(-1), 10) + 1;

		// All diseases have been queried
		if (counter >= Object.keys(this.container.client.symptomsPerDisease).length) return this.conclude(interaction);

		const diseases = Object.keys(this.container.client.symptomsPerDisease) as Array<keyof typeof this.container.client.symptomsPerDisease>;
		const nextSymptoms = this.container.util.parseDiseaseSymptoms(diseases[counter])
			.filter(symptom => !userDir.asked.includes(symptom.value));
		userDir.asked.push(...nextSymptoms.map(symptom => symptom.value));

		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder({
				custom_id: `diagnosis:flow-${counter}`,
				placeholder: "What's wrong?",
				max_values: nextSymptoms.length,
				options: [
					...nextSymptoms,
					{
						label: "NOTA",
						description: "None of the above.",
						value: "none"
					}
				],
			})
		);

		return interaction.update({
			content: "Select all symptoms that the patient is experiencing.",
			components: [actionRow]
		});
	}

	private async conclude(interaction: StringSelectMenuInteraction) {
		const symptoms = Object.keys(this.container.client.symptomQuestions) as Array<keyof typeof this.container.client.symptomQuestions>;

		const YES = this.container.client.directory.get(interaction.user.id)!.indicators;
		const NO = symptoms.filter(symptom => !YES.includes(symptom));

		const embed = new EmbedBuilder({
			title: "Diagnosis",
			description: "The diagnosis is..."
			// TODO: Add the diagnosis
		}).setColor('Random');

		return interaction.update({
			content: "Thank you for that information. We will now proceed to the diagnosis.",
			embeds: [embed],
			components: []
		});
	}
}
