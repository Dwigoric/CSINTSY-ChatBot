import { SapphireClient } from '@sapphire/framework';
import { ClientOptions } from "discord.js";

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

    constructor(options: ClientOptions) {
        super(options);

        this.pl = require('tau-prolog');
    }
}

declare module 'discord.js' {
    interface Client {
        pl: tau_prolog;
    }
}
