import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

export class DiagnoseProcessHandler extends InteractionHandler {
    private readonly BASE_ID: string;

    public constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu,
        });

        Object.defineProperty(this, "BASE_ID", {
            configurable: false,
            writable: false,
            value: "diagnosis:flow",
        });
    }

    public override parse(interaction: StringSelectMenuInteraction) {
        if (!interaction.customId.startsWith(this.BASE_ID)) return this.none();

        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        // These are the symptoms selected by the user
        const symptoms = interaction.values.filter((value) => value !== "none") as Array<keyof typeof this.container.client.symptomQuestions>;

        const userDir = this.container.client.directory.get(interaction.user.id)!;
        userDir.indicators.push(...(symptoms as typeof userDir.indicators));

        const counter = parseInt(interaction.customId.slice(this.BASE_ID.length + 1), 10) + 1;

        // All diseases have been queried
        if (counter >= Object.keys(this.container.client.symptomsPerDisease).length) return this.conclude(interaction);

        const diseases = Object.keys(this.container.client.symptomsPerDisease) as Array<keyof typeof this.container.client.symptomsPerDisease>;
        const nextSymptoms = this.container.util.parseDiseaseSymptoms(diseases[counter]).filter((symptom) => !userDir.asked.includes(symptom.value));
        userDir.asked.push(...nextSymptoms.map((symptom) => symptom.value));

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder({
                custom_id: `${this.BASE_ID}-${counter}`,
                placeholder: "What's wrong?",
                max_values: nextSymptoms.length,
                options: [
                    ...nextSymptoms,
                    {
                        label: "NOTA",
                        description: "None of the above.",
                        value: "none",
                    },
                ],
            })
        );

        return interaction.update({
            content: "Select all symptoms that the patient is experiencing.",
            components: [actionRow],
        });
    }

    private async conclude(interaction: StringSelectMenuInteraction) {
        type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";
        type Lifestyles =
            | "needle_accident"
            | "drug_shared"
            | "travel"
            | "smoke"
            | "multiple_partners"
            | "unsure_protection"
            | "unsafe_sex_practices"
            | "msm"
            | "contaminated"
            | "measles_vaccination"

        const indicators = [
            ...Object.keys(this.container.client.symptomQuestions),
            "high_blood_pressure",
            "diabetes",
            "uti",
            "breast_cancer",
            "needle_accident",
            "drug_shared",
            "travel",
            "mutliple_partners",
            "unsure_protection",
            "unsafe_sex_practices",
            "msm",
            "contaminated",
            "measles_vaccination"
        ] as Array<keyof typeof this.container.client.symptomQuestions | FamilyHistory | Lifestyles>;

        const YES = this.container.client.directory.get(interaction.user.id)!.indicators;
        const NO = indicators.filter((indicator) => !YES.includes(indicator));
        const user = this.container.client.directory.get(interaction.user.id)!;

        await this.container.client.getDiagnosis(YES, NO, user, interaction.user.id, interaction);
    }
}
