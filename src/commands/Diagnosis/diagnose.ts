import {ChatInputCommand, Command} from '@sapphire/framework';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';

export class DiagnoseCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Starts a diagnosis session.'
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(builder => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the user to diagnose.')
                        .setRequired(true))
        }, {
            guildIds: [process.env.TEST_GUILD_ID ?? ''],
            idHints: ['1092963801625792512']
        });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (this.container.client.sessions.has(interaction.user.id)) {
            return interaction.reply({
                content: 'You already have a diagnostic session in progress.',
                ephemeral: true
            });
        }

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('diagnosis:agree')
                    .setLabel('I agree')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success)
            )

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Hello, ${interaction.options.getString('name')}!`)
                    .setDescription([
                        '**Agreement**',
                        '',
                        'By continuing, you agree to the following:',
                        '1. This bot is not a medical professional.',
                        '2. This bot is not responsible for any harm caused by the diagnosis.',
                        '3. Any diagnosis given by this bot is not a substitute for a real diagnosis by a medical professional.'
                    ].join('\n'))
                    .addFields([
                        {
                            name: 'What about my data?',
                            value: [
                                'Your data will NOT be stored on a persistent database.',
                                'Moreover, your data will NOT be shared with any third-party services.',
                                'However, your data will be stored in memory for the duration of the diagnosis session.'
                            ].join(' ')
                        }
                    ])
            ],
            components: [actionRow],
            ephemeral: true
        });
    }
}