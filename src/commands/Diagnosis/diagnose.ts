import { Command } from '@sapphire/framework';
import { Snowflake } from 'discord-api-types/globals';
import { Message } from 'discord.js';

export class DiagnoseCommand extends Command {
    private sessions: Map<Snowflake, Snowflake>;

    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Starts a diagnosis session.'
        });

        // The sessions map is used to store the diagnosis session for each user.
        // The key is the user's ID, and the value is the Discord channel ID.
        this.sessions = new Map();
    }

    async messageRun(message: Message) {
        // If the user is already in a diagnosis session, then send a message to the channel
        // that the user is already in a session.
        if (this.sessions.has(message.author.id)) {
            return message.channel.send('You are already in a diagnosis session.');
        }

        // Create a new diagnosis session for the user.
        const session = await message.channel.send('Starting diagnosis session...');

        // Add the user to the sessions map.
        this.sessions.set(message.author.id, session.channel.id);

        // Send a message to the user to tell them that the session has started.
        await message.channel.send('Diagnosis session started.');

        // Start the diagnosis session.
        await this.startSession(message);

        // Send a message to the user to tell them that the session has ended.
        await message.channel.send('Diagnosis session ended.');

        // Remove the user from the sessions map.
        this.sessions.delete(message.author.id);
    }

    private async startSession(message: Message) {
        return message.channel.send('This command is not yet implemented.');
    }
}