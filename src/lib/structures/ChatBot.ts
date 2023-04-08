import { SapphireClient } from "@sapphire/framework";
import { ClientOptions, Snowflake } from "discord.js";


// ------------------ Prolog ------------------
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


// ------------------ Personal Data ------------------
const symptomQuestions = Object.freeze({
	fever: "Are you experiencing a fever or chills?",
	mucus: "Do you produce green, yellow, or bloody mucus when you cough?",
	fatigue: "Do you feel extremely tired or have little to no energy?",
	shortness_of_breath: "Do you experience shortness of breath?",
	cough: "Are experiencing a cough?",
	weight_loss: "Have you unexpectedly lost weight recently?",
	afternoon_sweats: "Do you experience sudden, intense sweating in the afternoon?",
	respiratory: "Do you have an upper respiratory infection?",
	swole_lymph_nodes: "Do you have swollen lymph nodes in the neck?",
	rash: "Do you have a rash on your skin?",
	red_eyes: "Do you have red, watery eyes?",
	nausea_or_vomiting: "Do you feel nauseous?",
	diarrhea: "Do you have diarrhea?",
	abdominal: "Do you have abdominal cramps or pain?",
	white_spot_or_purple_patch: "Do you have a white spot or purple patch in your mouth?",
	muscle_ache: "Do you have muscle aches?",
	multi_infections: "Have you had multiple unexplained infections, such as TB, pneumonia, or salmonella?",
	kidney: "Do you have kidney problems?",
	headache: "Do you have severe headaches?",
	malaise: "Are you experiencing severe headaches, eye or joint pain, or muscle and/or bone pain?",
	bleeding: "Do you have bleeding from your nose, gums, and under your skin?",
	urge_to_urinate: "Do you have an urge to urinate frequently?",
	burning_sensation: "Do you have a burning sensation when you urinate?",
	small_urine: "Are you experiencing only small amounts of urine when you urinate?",
	dark_urine: "Is your urine dark in color?",
	thirst: "Are you experiencing extreme thirst?",
	hunger: "Are you experiencing extreme hunger?",
	lumps: "Have you noticed any lumps or thickening in your breast or armpit area?",
	breast_change: "Have you noticed any changes in the size, shape, or color of your breast or nipple?",
	blood_discharge: "Have you noticed any blood discharge from your nipple, other than during breastfeeding?",
	pain_nipple: "Have you experienced any pain or tenderness in your breast or nipple?"
});
type SymptomQuestions = typeof symptomQuestions;

type FamilyHistory = "high_blood_pressure" | "diabetes" | "uti" | "breast_cancer";
interface PersonalData {
	age: number;
	biologicalSex: string;
	height: number;
	weight: number;
	bodyTemperature: number;
	systolicBloodPressure: number;
	diastolicBloodPressure: number;
	history: FamilyHistory[];
	accomplishedHistory: boolean;
	accomplishedLifestyle: boolean;
	started: boolean;

	indicators: (keyof SymptomQuestions)[];
}


// ------------------ ChatBot ------------------
export default class ChatBot extends SapphireClient {
	pl: TauPrologInstance;
	session: Session;
	personalData: PersonalData;
	symptomQuestions: SymptomQuestions;

	// Snowflake is a string, but it's a string of numbers.
	// ChatBot#sessions is a map of user IDs to their personal data.
	directory: Map<Snowflake, PersonalData>;

	constructor(options: ClientOptions) {
		super(options);

		this.pl = require("tau-prolog");
		this.session = this.pl.create({ limit: 1000 });
		this.symptomQuestions = symptomQuestions;
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
		symptomQuestions: SymptomQuestions;
		directory: Map<Snowflake, PersonalData>;

		getSymptoms(query: string): void;
		setPersonalData(userInput: PersonalData): void;
		getPersonalData(): PersonalData;
	}
}
