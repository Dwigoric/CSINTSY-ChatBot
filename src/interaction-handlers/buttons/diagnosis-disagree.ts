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
        const data = this.container.client.directory.get(interaction.user.id);
        if (data && data.started) {
            interaction.reply({
                content: '❌ You have already started your diagnosis session.',
                ephemeral: true
            });
            return this.none();
        }

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
