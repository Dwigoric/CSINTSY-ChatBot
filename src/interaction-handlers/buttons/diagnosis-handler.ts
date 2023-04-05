import {InteractionHandler, InteractionHandlerTypes, PieceContext} from "@sapphire/framework";
import {ButtonInteraction} from "discord.js";

export class DiagnosisHandler extends InteractionHandler {
    public constructor(context: PieceContext, options: InteractionHandler.Options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'diagnosis:agree') return this.none();

        return this.some();
    }

    /**
     * This is where the questions will be asked.
     * @param interaction   The interaction that triggered this handler.
     */
    public async run(interaction: ButtonInteraction) {
        if (this.container.client.sessions.has(interaction.user.id)) return;
        this.container.client.sessions.set(interaction.user.id, interaction.channelId);

        const plSession = this.container.client.pl.create({limit: 1000});

        plSession.query(`
            question(Question, Answer) :-
                question(Question, Answer, _).
        `);
    }
}
