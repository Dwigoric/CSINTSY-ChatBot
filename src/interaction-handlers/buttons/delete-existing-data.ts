import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ButtonInteraction} from "discord.js";

export class ExistingDataHandler extends InteractionHandler {
    constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'diagnosis:existing') return this.none();

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        this.container.client.sessions.delete(interaction.user.id);
        return interaction.reply({
            content: 'Existing session successfully deleted! You can now start a new session.',
            ephemeral: true
        });
    }
}