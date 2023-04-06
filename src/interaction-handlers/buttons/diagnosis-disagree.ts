import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ButtonInteraction} from "discord.js";

export class DiagnosisDisagreeHandler extends InteractionHandler {
    constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'diagnosis:disagree') return this.none();

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        this.container.client.directory.delete(interaction.user.id);
        return interaction.reply({
            content: 'Diagnosis session cancelled.',
            ephemeral: true
        });
    }
}
