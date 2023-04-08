import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export class MultiplePartnersHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== "diagnosis:unsafe-sex") return this.none();

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: "diagnosis:multiple-partners:y",
					label: "Yes",
					style: ButtonStyle.Success
				}),
				new ButtonBuilder({
					customId: "diagnosis:multiple-partners",
					label: "No",
					style: ButtonStyle.Danger
				})
			);

		return interaction.update({
			content: "Did the patient have multiple partners in the sexual intercourse?",
			components: [actionRow]
		});
	}
}
