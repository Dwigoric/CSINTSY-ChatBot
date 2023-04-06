import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ActionRowBuilder, ButtonInteraction, StringSelectMenuBuilder} from "discord.js";

export class FamilyHistoryHandler extends InteractionHandler {
    constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'diagnosis:agree') return this.none();

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder({
                    custom_id: 'diagnosis:history',
                    min_values: 1,
                    max_values: 4,
                    options: [
                        {
                            label: 'High blood pressure',
                            description: 'Patient\'s family has history of high blood pressure.',
                            value: 'high_blood_pressure'
                        },
                        {
                            label: 'Diabetes',
                            description: 'Patient\'s family has history of diabetes.',
                            value: 'diabetes'
                        },
                        {
                            label: 'UTI',
                            description: 'Patient\'s family has history of UTI.',
                            value: 'uti'
                        },
                        {
                            label: 'Breast cancer',
                            description: 'Patient\'s family has history of breast cancer.',
                            value: 'breast_cancer'
                        },
                        {
                            label: 'NOTA',
                            description: 'None of the above.',
                            value: 'none'
                        }
                    ]
                })
            );

        return interaction.reply({
            content: 'I will now ask you about the patient\'s family history. Please select all that apply.',
            components: [actionRow],
            ephemeral: true
        });
    }
}
