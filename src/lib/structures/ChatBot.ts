import { SapphireClient } from "@sapphire/framework";
import { ClientOptions } from "discord.js";

interface Session {
    consult: (code: string) => void;
    query: (code: string) => {
        solution: () => {
            unify: (variable: string, value: string) => void;
        };
        next: () => void;
    };
}

interface TauPrologInstance {
    create: (options: { limit: number }) => Session;
}

const diagnosis = (session: Session) => {
    session.consult("../../knowledgeBase.pro"),
        {
            success: () => {
                session.query("member(X, [a, b, c])."),
                    {
                        success: () => {},
                        fail: () => {},
                        error: (err: unknown) => {
                            if (err instanceof Error) {
                                console.log(
                                    `[ERROR in query - ChatBot.ts] ${err.message}]`
                                );
                            }
                        },
                    };
            },

            error: (err: unknown) => {
                if (err instanceof Error) {
                    console.log(
                        `[ERROR in consult - ChatBot.ts] ${err.message}]`
                    );
                }
            },
        };
};

export default class ChatBot extends SapphireClient {
    pl: TauPrologInstance;

    constructor(options: ClientOptions) {
        super(options);

        this.pl = require("tau-prolog");
    }

    async start() {
        const session: Session = this.pl.create({ limit: 1000 });
        diagnosis(session);
    }
}

declare module "discord.js" {
    interface Client {
        pl: TauPrologInstance;
    }
}
