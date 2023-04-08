import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

export class LifestyleInteractionHandler extends InteractionHandler {
	constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu,
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (interaction.customId !== "diagnosis:history") return this.none();

		const userDir = this.container.client.directory.get(interaction.user.id);
		if (!userDir) {
			interaction.reply({
				content: "Your session was not found. Please start a new session.",
				ephemeral: true,
			});
			return this.none();
		}
		if (userDir.accomplishedHistory) {
			interaction.reply({
				content: "You have already accomplished the family history section.",
				ephemeral: true,
			});
			return this.none();
		}

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		// Handle family history
		type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";

		const userDir = this.container.client.directory.get(interaction.user.id)!;
		userDir.started = true; // Mark the session as started
		userDir.history = interaction.values.filter((value) => value !== "none") as FamilyHistory[];
		userDir.accomplishedHistory = true;

		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
			.addComponents(
				new StringSelectMenuBuilder({
					custom_id: "diagnosis:lifestyle",
					min_values: 1,
					max_values: 2,
					options: [
						{
							label: "Smoking",
							description: "Patient smokes.",
							value: "smoking"
						},
						{
							label: "Unsafe sex",
							description: "Whether the patient has had unsafe sex.",
							value: "unsafe_sex"
						},
						{
							label: "NOTA",
							description: "None of the above.",
							value: "none"
						}
					]
				})
			)

		return interaction.reply({
			content: "I will now ask you about the patient's lifestyle. Please select all that apply.",
			components: [actionRow],
			ephemeral: true
		});
	}
}
