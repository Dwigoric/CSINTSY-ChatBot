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
        const symptoms = Object.keys(this.container.client.symptomQuestions) as Array<keyof typeof this.container.client.symptomQuestions>;

        const YES = this.container.client.directory.get(interaction.user.id)!.indicators;
        const NO = symptoms.filter((symptom) => !YES.includes(symptom));
        const user = this.container.client.directory.get(interaction.user.id)!;
        await this.container.client.getDiagnosis(YES, NO, user, interaction.user.id);

        // const diagnosis = this.container.client.directory.get(interaction.user.id)!.diagnosis;

        // console.log(diagnosis);

        const embed = new EmbedBuilder({
            title: "Diagnosis",
            description: `You have a ${this.container.client.directory.get(interaction.user.id)!.diagnosis.certainty}% chance of having ${
                this.container.client.directory.get(interaction.user.id)!.diagnosis.disease
            }.`,
        }).setColor("Random");

        // Delete the user's directory
        this.container.client.directory.delete(interaction.user.id);

        return interaction.update({
            content: "Thank you for that information. Here's your diagnosis. Your data has been deleted from memory.",
            embeds: [embed],
            components: [],
        });
    }
}
