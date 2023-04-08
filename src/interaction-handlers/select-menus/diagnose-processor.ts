import { InteractionHandler, InteractionHandlerTypes, PieceContext, container } from "@sapphire/framework";
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

const symptomsPerDisease: Readonly<{ (P: string): keyof (typeof container.client.symptomQuestions) }> = Object.freeze({
	bacterial_pneumonia: ["fever", "mucus", "fatigue", "shortness_of_breath", "cough"],
	tuberculosis: ["cough", "weight_loss", "afternoon_sweats", "swole_lymph_nodes"],
	measles: ["fever", "rash", "red_eyes", "respiratory"],
	hypertension: ["kidney", "headache"],
	gastroenteritis: ["fever", "chills", "nausea_or_vomiting", "diarrhea", "abdominal"],
	dengue: ["fever", "malaise", "rash", "nausea_or_vomiting", "bleeding"],
	uti: ["urge_to_urinate", "burning_sensation", "small_urine", "dark_urine", "fever", "chills"],
	diabetes: ["thirst", "weight_loss", "hunger", "fatigue"],
	breast_cancer: ["lumps", "breast_change", "blood_discharge", "pain_nipple", "swole_lymph_nodes"],
	hiv: ["fever", "weight_loss", "white_spot", "purple_patch", "fatigue", "muscle_ache", "swole_lymph_nodes", "multi_infections"]
});

export class DiagnoseProcessHandler extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu,
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (interaction.customId !== "diagnosis:flow") return this.none();

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		// This is the symptom that the user selected
		const symptom = interaction.values[0];

		/**
		 * TODO: Pass the symptom to prolog and get the symptoms returned by the prolog engine.
		 * This is where the prolog engine will be called.
		 */
		console.log(symptom);

		// this.container.client.consultFamilyHistory("symp(disease");

		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder({
				custom_id: "diagnosis:flow",
				placeholder: "What's wrong?",
				max_values: 1,
				/**
				 * The options are the symptoms returned by the prolog engine.
				 * Format:
				 *      { label: 'Coughing', value: 'cough' }
				 * where the label is the symptom name and the value is the symptom id (for prolog use).
				 */
				options: [],
			})
		);

		return interaction.reply({
			content: "Please select the symptom you are experiencing.",
			components: [actionRow],
			ephemeral: true,
		});
	}
}
