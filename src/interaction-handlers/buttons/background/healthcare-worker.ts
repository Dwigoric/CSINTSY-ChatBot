import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuInteraction } from "discord.js";

export class HealthcareWorkerHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu
		});
	}

	public override parse(interaction: SelectMenuInteraction) {
		if (interaction.customId !== 'diagnosis:history') return this.none();

		type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.history = interaction.values.filter((value) => value !== "none") as FamilyHistory[];

		return this.some();
	}

	public async run(interaction: SelectMenuInteraction) {
		const actionRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder({
					customId: 'diagnosis:healthcare-worker',
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
			content: "Is the patient a healthcare worker?",
			components: [actionRow]
		});
	}
}
