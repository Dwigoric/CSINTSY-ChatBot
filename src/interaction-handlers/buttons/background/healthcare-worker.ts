import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export class HealthcareWorkerHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'diagnosis:agree') return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.started = true;

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
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
			components: [actionRow],
			embeds: []
		});
	}
}
