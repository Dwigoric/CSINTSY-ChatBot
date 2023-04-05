import {SapphireClient} from '@sapphire/framework';
import {ClientOptions, Snowflake} from "discord.js";

interface tau_prolog {
    create: (options: { limit: number }) => {
        consult: (code: string) => void;
        query: (code: string) => {
            solution: () => {
                unify: (variable: string, value: string) => void;
            },
            next: () => void;
        }
    }
}

export default class ChatBot extends SapphireClient {
    pl: tau_prolog;

    // Snowflake is a string, but it's a string of numbers.
    // ChatBot#sessions is a map of user IDs to sessions (channel IDs).
    sessions: Map<Snowflake, Snowflake>;

    constructor(options: ClientOptions) {
        super(options);

        this.pl = require('tau-prolog');
        this.sessions = new Map<Snowflake, Snowflake>();
    }
}

declare module 'discord.js' {
    interface Client {
        pl: tau_prolog;
        sessions: Map<Snowflake, Snowflake>;
    }
}
