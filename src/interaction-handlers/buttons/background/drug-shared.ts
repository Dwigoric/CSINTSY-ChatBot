import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export class ShareNeedlesHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith("diagnosis:needle-accident")) return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		if (interaction.customId.slice(-1) === "y") userDir.indicators.push("needle_accident");

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: "diagnosis:drug-shared:y",
					label: "Yes",
					style: ButtonStyle.Success
				}),
				new ButtonBuilder({
					customId: "diagnosis:drug-shared",
					label: "No",
					style: ButtonStyle.Danger
				})
			);

		return interaction.update({
			content: "Has the patient shared needles or drug paraphernalia with someone whose HIV/STD status is unknown?",
			components: [actionRow]
		});
	}
}
