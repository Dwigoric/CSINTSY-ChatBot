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
        if (!['diagnosis:existing', 'diagnosis:disagree'].includes(interaction.customId)) return this.none();
        const data = this.container.client.directory.get(interaction.user.id);
        if (!data) {
            interaction.reply({
                content: '❌ You have no existing diagnosis session.',
                ephemeral: true
            });
            return this.none();
        }
        else if (data && data.started) {
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
        return interaction.update({
            content: interaction.customId === 'diagnosis:existing' ?
                'Existing session successfully deleted! You can now start a new session.' :
                'Diagnosis session cancelled.',
        });
    }
}