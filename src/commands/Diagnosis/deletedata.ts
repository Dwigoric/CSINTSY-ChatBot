import { ChatInputCommand, Command, PieceContext } from "@sapphire/framework";

export class DeleteDataCommand extends Command {
	constructor(context: PieceContext, options: Command.Options) {
		super(context, {
			...options,
			description: "Deletes all data associated with the user.",
		});
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) =>
					option
						.setName("agree")
						.setDescription("I have dismissed the interaction message and agree to delete all data.")
						.setRequired(true)
				);
		}, {
			guildIds: [process.env.TEST_GUILD_ID ?? ""],
			idHints: ["1094843143532318783"]
		});
	}

	public async chatInputRun(
		interaction: ChatInputCommand.Interaction
	) {
		if (!this.container.client.directory.has(interaction.user.id)) {
            return interaction.reply({
                content: "You do not have an active session.",
                ephemeral: true
            });
        }

		const agree = interaction.options.getBoolean("agree")!;

		if (!agree) {
			return interaction.reply({
				content: "You must agree to delete all data and dismiss the interaction message.",
				ephemeral: true
			});
		}

		this.container.client.directory.delete(interaction.user.id);

		return interaction.reply({
			content: "All data has been deleted.",
			ephemeral: true
		});
	}
}
