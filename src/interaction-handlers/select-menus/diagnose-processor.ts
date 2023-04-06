import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction} from "discord.js";

export class DiagnoseProcessHandler extends InteractionHandler {
    public constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu
        });
    }

    public override parse(interaction: StringSelectMenuInteraction) {
        if (interaction.customId !== 'diagnosis:flow') return this.none();

        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        // This is the symptom that the user selected
        const symptom = interaction.values[0];

        /**
         * TODO: Pass the symptom to prolog and get the symptoms returned by the prolog engine.
         * This is where the prolog engine will be called.
         */

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder({
                    custom_id: 'diagnosis:flow',
                    placeholder: 'What\'s wrong?',
                    max_values: 1,
                    /**
                     * The options are the symptoms returned by the prolog engine.
                     * Format:
                     *      { label: 'Coughing', value: 'cough' }
                     * where the label is the symptom name and the value is the symptom id (for prolog use).
                     */
                    options: []
                })
            )

        return interaction.reply({
            content: 'Please select the symptom you are experiencing.',
            components: [actionRow],
            ephemeral: true
        });
    }
}
