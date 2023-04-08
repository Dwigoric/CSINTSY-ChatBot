import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ActionRowBuilder, StringSelectMenuInteraction, StringSelectMenuBuilder } from "discord.js";

export class DiagnosisInitializer extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
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

		// TODO: Pass the family history to prolog
		console.log(userDir.history);

		// Initiate the flow of the diagnosis
		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder({
				custom_id: "diagnosis:flow",
				placeholder: "What's wrong?",
				max_values: 3,
				options: [
					{ label: "Coughing", value: "cough" },
					{ label: "Fever", value: "fever" },
					{ label: "Weight Loss", value: "weight_loss" },
					{ label: "NOTA", description: "None of the above.", value: "none" },
				],
			})
		);

		return interaction.reply({
			content: "Thank you for that information. To start, select all symptoms that the patient is experiencing.",
			components: [actionRow],
			ephemeral: true,
		});
	}
}
