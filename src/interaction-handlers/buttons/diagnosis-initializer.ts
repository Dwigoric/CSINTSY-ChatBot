import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

export class DiagnosisInitializer extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu,
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.startsWith("diagnosis:history")) return this.none();

		type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.indicators.push(...(interaction.values.filter((value) => value !== "none") as FamilyHistory[]))

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		const diseases = Object.keys(this.container.client.symptomsPerDisease) as Array<keyof typeof this.container.client.symptomsPerDisease>;
		const initialSymptoms = this.container.util.parseDiseaseSymptoms(diseases[0]);

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.asked.push(...initialSymptoms.map((symptom) => symptom.value));

		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder({
				custom_id: "diagnosis:flow-0",
				placeholder: "What's wrong?",
				max_values: initialSymptoms.length,
				options: [
					...initialSymptoms,
					{
						label: "NOTA",
						description: "None of the above.",
						value: "none",
					},
				],
			})
		);

		return interaction.update({
			content: "Thank you for that information. Now, select all symptoms that the patient is experiencing.",
			components: [actionRow],
		});
	}
}
