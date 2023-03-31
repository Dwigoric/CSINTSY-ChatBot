import { GatewayIntentBits, ActivityType } from 'discord.js';

export default {
    /**
     * General Options
     */
    // The default configurable prefix for each guild
    defaultPrefix: '!',
    // If the bot will be insensitive to the prefix case
    caseInsensitivePrefixes: true,
    // If the bot will be insensitive to the command case
    caseInsensitiveCommands: true,
    // Whether the bot will appear as typing when a command is accepted
    typing: true,
    // If your bot should be able to mention
    allowedMentions: { parse: ['roles', 'users'] },
    // The time in ms to add to ratelimits, to ensure you won't hit a 429 response
    restTimeOffset: 500,
    // The number of invalid REST requests in a 10-minute window between emitted warnings (0 for no warnings)
    invalidRequestWarningInterval: 1,
    // A presence to login with
    presence: { status: 'online', activities: [{ name: 'illnesses', type: ActivityType.Watching }] },
    // Whether to load the message command listeners
    loadMessageCommandListeners: true,
    // Intents
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages
    ],

    /**
     * Caching Options
     */
    partials: ['GUILD_MEMBER', 'USER', 'CHANNEL'],
    sweepers: {
        messages: {
            interval: 30,
            lifetime: 60
        }
    },

    /**
     * Sharding Options
     */
    shards: 'auto',
    shardCount: 1
};
