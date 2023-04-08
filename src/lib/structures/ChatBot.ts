import { container, SapphireClient } from "@sapphire/framework";
import { ClientOptions, Snowflake } from "discord.js";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);

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
	pain_nipple: "Have you experienced any pain or tenderness in your breast or nipple?",
	chills: "Are you experiencing chills?",
});

const symptomsPerDisease = Object.freeze({
	bacterial_pneumonia: ["fever", "mucus", "fatigue", "shortness_of_breath", "cough"],
	tuberculosis: ["cough", "weight_loss", "afternoon_sweats", "swole_lymph_nodes"],
	measles: ["fever", "rash", "red_eyes", "respiratory"],
	hypertension: ["kidney", "headache"],
	gastroenteritis: ["fever", "chills", "nausea_or_vomiting", "diarrhea", "abdominal"],
	dengue: ["fever", "malaise", "rash", "nausea_or_vomiting", "bleeding"],
	uti: ["urge_to_urinate", "burning_sensation", "small_urine", "dark_urine", "fever", "chills"],
	diabetes: ["thirst", "weight_loss", "hunger", "fatigue"],
	breast_cancer: ["lumps", "breast_change", "blood_discharge", "pain_nipple", "swole_lymph_nodes"],
	hiv: ["fever", "weight_loss", "white_spot_or_purple_patch", "fatigue", "muscle_ache", "swole_lymph_nodes", "multi_infections"],
});

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

	counter: number;
	indicators: (keyof typeof symptomQuestions)[];
	asked: (keyof typeof symptomQuestions)[];
}

// ------------------ ChatBot ------------------
export default class ChatBot extends SapphireClient {
	session: pl.type.Session;
	personalData: PersonalData;
	symptomQuestions: typeof symptomQuestions;
	symptomsPerDisease: typeof symptomsPerDisease;

	// Snowflake is a string, but it's a string of numbers.
	// ChatBot#sessions is a map of user IDs to their personal data.
	directory: Map<Snowflake, PersonalData>;

	constructor(options: ClientOptions) {
		super(options);

		container.util = require("../util/util");

		this.session = this.pl.create({ limit: 1000 });
		this.symptomQuestions = symptomQuestions;
		this.symptomsPerDisease = symptomsPerDisease;
		this.directory = new Map();
	}

	async start() {}

	async getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[]) {
		await this.session.promiseConsult("../../knowledgeBase.pro");

		for (const symptom of confirmedSymptoms) await this.session.promiseQuery(`assert(has(${symptom})).`);
		for (const symptom of unconfirmedSymptoms) this.session.promiseQuery(`assert(no(${symptom})).`);

		const result = await this.session.promiseQuery(`diagnosis(${this.container.client.name}).`);
	}
}

declare module "@sapphire/pieces" {
	interface Container {
		util: typeof import("../util/util");
	}
}

declare module "@sapphire/framework" {
	interface SapphireClient {
		pl: TauPrologInstance;
		session: Session;
		personalData: PersonalData;
		symptomQuestions: typeof symptomQuestions;
		symptomsPerDisease: typeof symptomsPerDisease;
		directory: Map<Snowflake, PersonalData>;

		getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[]): void;
		setPersonalData(userInput: PersonalData): void;
		getPersonalData(): PersonalData;
	}
}
