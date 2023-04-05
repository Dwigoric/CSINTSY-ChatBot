import {ChatInputCommand, Command} from '@sapphire/framework';
import {Snowflake} from 'discord-api-types/globals';
import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';

interface DiagnosisSession {
    interaction: Command.ChatInputCommandInteraction;
    name: string;
}

export class DiagnoseCommand extends Command {
    private sessions: Map<Snowflake, DiagnosisSession>;

    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Starts a diagnosis session.'
        });

        // The sessions map is used to store the diagnosis session for each user.
        // The key is the user's ID, and the value is the session (interaction) ID.
        this.sessions = new Map<Snowflake, DiagnosisSession>();
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(builder => {
            builder
                .setName(this.name)
                .setDescription(this.description)
        }, {
            guildIds: [process.env.TEST_GUILD_ID ?? ''],
            idHints: ['1092963801625792512']
        });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (this.sessions.has(interaction.user.id)) {
            return interaction.reply({
                content: 'You already have a diagnostic session in progress.',
                ephemeral: true
            });
        }

        const modal = new ModalBuilder()
            .setTitle('What is your name?')
            .setCustomId('diagnosis-name-modal');

        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Name')
            .setPlaceholder('Your name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        modal.addComponents(actRow);

        await interaction.showModal(modal);
    }
}