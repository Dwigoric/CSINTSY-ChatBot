import {SapphireClient} from '@sapphire/framework';
import {ClientOptions, Snowflake} from "discord.js";

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

type FamilyHistory = 'high_blood_pressure' | 'diabetes' | 'uti' | 'breast_cancer';
interface PersonalData {
    age: number;
    biologicalSex: string;
    height: number;
    weight: number;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    smoking: boolean;
    history: FamilyHistory[];
    accomplishedHistory: boolean;
    started: boolean;
}

export default class ChatBot extends SapphireClient {
    pl: TauPrologInstance;

    // Snowflake is a string, but it's a string of numbers.
    // ChatBot#sessions is a map of user IDs to their personal data.
    directory: Map<Snowflake, PersonalData>;

    constructor(options: ClientOptions) {
        super(options);

        this.pl = require("tau-prolog");
        this.directory = new Map();
    }

    async start() {
        const session: Session = this.pl.create({ limit: 1000 });
        diagnosis(session);
    }
}

declare module "discord.js" {
    interface Client {
        pl: TauPrologInstance;
        directory: Map<Snowflake, PersonalData>;
    }
}

function diagnosis(session: Session) {
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
}
