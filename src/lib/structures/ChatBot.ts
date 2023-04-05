import {Command, SapphireClient} from '@sapphire/framework';
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

interface DiagnosisSession {
    interaction: Command.ChatInputCommandInteraction;
    name: string;
}

export default class ChatBot extends SapphireClient {
    pl: tau_prolog;
    sessions: Map<string, DiagnosisSession>;

    constructor(options: ClientOptions) {
        super(options);

        this.pl = require('tau-prolog');
        this.sessions = new Map<Snowflake, DiagnosisSession>();
    }
}

declare module 'discord.js' {
    interface Client {
        pl: tau_prolog;
        sessions: Map<string, DiagnosisSession>;
    }
}
