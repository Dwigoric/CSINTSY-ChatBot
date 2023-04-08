import { SapphireClient } from "@sapphire/framework";
import { ClientOptions, Snowflake } from "discord.js";

interface Session {
	consult: (code: string) => void;
	query: (code: string) => {
		solution: () => {
			unify: (variable: string, value: string) => void;
		};
		next: () => void;
	};
	answers: {
		[variable: string]: string;
	};
}

interface TauPrologInstance {
	create: (options: { limit: number }) => Session;
}

type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";
interface PersonalData {
	age: number;
	biologicalSex: string;
	height: number;
	weight: number;
	bodyTemperature: number;
	systolicBloodPressure: number;
	diastolicBloodPressure: number;
	smoking: boolean;
	history: FamilyHistory[];
	accomplishedHistory: boolean;
	started: boolean;
}

export default class ChatBot extends SapphireClient {
	pl: TauPrologInstance;
	session: Session;
	personalData: PersonalData;

	// Snowflake is a string, but it's a string of numbers.
	// ChatBot#sessions is a map of user IDs to their personal data.
	directory: Map<Snowflake, PersonalData>;

	constructor(options: ClientOptions) {
		super(options);

		this.pl = require("tau-prolog");
		this.session = this.pl.create({ limit: 1000 });
		this.directory = new Map();
	}

	async start() {}

	getSymptoms(query: string) {
		this.session.consult("../../knowledgeBase.pro");
	}
}

declare module "@sapphire/framework" {
	interface SapphireClient {
		pl: TauPrologInstance;
		session: Session;
		personalData: PersonalData;
		directory: Map<Snowflake, PersonalData>;

		getSymptoms(query: string): void;
		setPersonalData(userInput: PersonalData): void;
		getPersonalData(): PersonalData;
	}
}
