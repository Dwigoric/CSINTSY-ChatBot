import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, StringSelectMenuBuilder, ButtonInteraction } from "discord.js";

export class DiagnosisInitializer extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith("diagnosis:measles")) return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		if (interaction.customId.slice(-1) === "y") userDir.indicators.push("measles_vaccination");

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
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
			content: "Thank you for that information. To start, select all symptoms that the patient is experiencing.",
			components: [actionRow],
		});
	}
}
