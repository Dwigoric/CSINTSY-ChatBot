import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export class UnsafeSexHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith("diagnosis:multiple-partners")) return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		if (interaction.customId.slice(-1) === "y") userDir.indicators.push("multiple_partners");

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: "diagnosis:unsure-protection:y",
					label: "Yes",
					style: ButtonStyle.Success
				}),
				new ButtonBuilder({
					customId: "diagnosis:unsure-protection",
					label: "No",
					style: ButtonStyle.Danger
				})
			);

		return interaction.update({
			content: "Did the patient have unprotected sexual contact with a partner whose HIV/STD status is unsure?",
			components: [actionRow]
		});
	}
}
