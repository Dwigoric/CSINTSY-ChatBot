import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ActionRowBuilder, ButtonInteraction, StringSelectMenuBuilder} from "discord.js";

export class DiagnosisInitializer extends InteractionHandler {
    public constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'diagnosis:agree') return this.none();
        if (this.container.client.sessions.has(interaction.user.id)) {
            interaction.reply({
                content: 'You already have an active session.',
                ephemeral: true
            });
            return this.none();
        }

        this.container.client.sessions.set(interaction.user.id, interaction.channelId);
        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder({
                    custom_id: 'diagnosis:flow',
                    placeholder: 'Select a symptom or habit that you are experiencing.',
                    max_values: 1,
                    options: [
                        { label: 'Coughing', value: 'cough' },
                        { label: 'Fever', value: 'fever' },
                        { label: 'Vomiting/Nausea', value: 'nausea' },
                        { label: 'Fatigue', value: 'fatigue' },
                        { label: 'Swelling lymph nodes', value: 'lymph' },
                        { label: 'Smoking', value: 'smoking' }
                    ]
                })
            );

        return interaction.reply({
            content: 'Please select a symptom or habit that you are experiencing.',
            components: [actionRow],
            ephemeral: true
        });
    }
}
