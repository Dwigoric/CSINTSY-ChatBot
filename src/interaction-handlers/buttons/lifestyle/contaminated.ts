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
		if (!interaction.customId.startsWith("diagnosis:msm")) return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		if (interaction.customId.slice(-1) === "y") userDir.indicators.push("msm");

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: "diagnosis:contaminated:y",
					label: "Yes",
					style: ButtonStyle.Success
				}),
				new ButtonBuilder({
					customId: "diagnosis:contaminated",
					label: "No",
					style: ButtonStyle.Danger
				})
			);

		return interaction.update({
			content: [
				"Has the patient recently eaten or drank something that may have been contaminated with bacteria",
				"or viruses, such as raw or undercooked foods, unpasteurized milk or juice, or unclean water?"
			].join(" "),
			components: [actionRow]
		});
	}
}
