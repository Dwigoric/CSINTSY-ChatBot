import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { Message } from "discord.js";
import { isMessageInstance } from "@sapphire/discord.js-utilities";

export class PingCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays bot\'s ping.',
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(builder => {
           builder
                .setName(this.name)
                .setDescription(this.description)
        }, {
            guildIds: [process.env.TEST_GUILD_ID ?? ''],
            idHints: ['1092428204653940827']
        });
    }

    public async chatInputRun(interaction: ChatInputCommand.Interaction) {
        const sentMessage = await interaction.reply({ content: 'Pinging...', ephemeral: true, fetchReply: true });

        return isMessageInstance(sentMessage) ?
            interaction.editReply(`Pong! Latency is ${sentMessage.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(container.client.ws.ping)}ms`) :
            interaction.editReply('Failed to get ping.');
    }

    async messageRun(message: Message) {
        const sentMessage = await message.channel.send('Pinging...');
        return sentMessage.edit(`Pong! Latency is ${sentMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(container.client.ws.ping)}ms`);
    }
}
