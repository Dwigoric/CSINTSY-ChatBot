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
        const client = container.client;
        const ping = client.ws.ping;
        return message.channel.send(`Pong! \`${ping}\`ms`);
    }
}
