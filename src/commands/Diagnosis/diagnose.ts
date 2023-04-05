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
                // Preliminary questions
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the user to diagnose.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('age')
                        .setDescription('The age of the user to diagnose.')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(122))
                .addStringOption(option =>
                    option
                        .setName('biological_sex')
                        .setDescription('The biological sex of the user to diagnose.')
                        .setRequired(true)
                        .setChoices(
                            { name: 'M', value: 'M' },
                            { name: 'F', value: 'F' }
                        ))
                .addNumberOption(option =>
                    option
                        .setName('height')
                        .setDescription('The height of the user to diagnose (in centimeters).')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(272))
                .addNumberOption(option =>
                    option
                        .setName('weight')
                        .setDescription('The weight of the user to diagnose (in kilograms).')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(635))
                .addBooleanOption(option =>
                    option
                        .setName('smoking')
                        .setDescription('Whether the user to diagnose smokes.')
                        .setRequired(true))
        }, {
            guildIds: [process.env.TEST_GUILD_ID ?? ''],
            idHints: ['1092963801625792512']
        });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (this.container.client.sessions.has(interaction.user.id)) {
            return interaction.reply({
                content: 'You already have an active session.',
                ephemeral: true
            });
        }
        this.container.client.sessions.set(interaction.user.id, {
            name: interaction.options.getString('name') as string,
            age: interaction.options.getInteger('age') as number,
            biologicalSex: interaction.options.getString('biological_sex') as string,
            height: interaction.options.getNumber('height') as number,
            weight: interaction.options.getNumber('weight') as number,
            smoking: interaction.options.getBoolean('smoking') as boolean
        });

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: 'diagnosis:agree',
                    label: 'I agree',
                    emoji: '✅',
                    style: ButtonStyle.Success
                }),
                new ButtonBuilder({
                    custom_id: 'diagnosis:disagree',
                    label: 'I disagree',
                    emoji: '✖',
                    style: ButtonStyle.Danger
                })
            )

        await interaction.reply({
            embeds: [
                new EmbedBuilder({
                    title: `Hello, ${interaction.options.getString('name')}!`,
                    description: [
                        '**Agreement**',
                        '',
                        'By continuing, you agree to the following:',
                        '1. This bot is not a medical professional.',
                        '2. This bot is not responsible for any harm caused by the diagnosis.',
                        '3. Any diagnosis given by this bot is not a substitute for a real diagnosis by a medical professional.',
                        '',
                        'If you agree to the above, please click the green button below.',
                        'Otherwise, please click the red button instead.'
                    ].join('\n'),
                    fields: [
                        {
                            name: 'What about my data?',
                            value: [
                                'Your data will NOT be stored on a persistent database.',
                                'Moreover, your data will NOT be shared with any third-party services.',
                                'However, your data will be stored in memory for the duration of the diagnosis session.'
                            ].join(' ')
                        }
                    ]
                })
            ],
            components: [actionRow],
            ephemeral: true
        });
    }
}