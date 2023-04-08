import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export class HealthcareWorkerAffirmativeHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'diagnosis:healthcare-worker') return this.none();

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: 'diagnosis:needle-accident:y',
					label: 'Yes',
					style: ButtonStyle.Success
				}),
				new ButtonBuilder({
					customId: 'diagnosis:needle-accident',
					label: 'No',
					style: ButtonStyle.Danger
				})
			);

		return interaction.update({
			content: "Have you had any accidental needle prick with a case of HIV?",
			components: [actionRow]
		});
	}
}
