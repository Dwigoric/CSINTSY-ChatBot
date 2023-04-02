import { Command, container } from '@sapphire/framework';
import { Message } from "discord.js";

export class PingCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays bot\'s ping.',
        });
    }

    async messageRun(message: Message) {
        const sentMessage = await message.channel.send('Pinging...');
        return sentMessage.edit(`Pong! Latency is ${sentMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(container.client.ws.ping)}ms`);
    }
}
