import { container, SapphireClient } from "@sapphire/framework";
import { ClientOptions, Snowflake } from "discord.js";

const program = `
:- dynamic(age/1).
:- dynamic(gender/1).
:- dynamic(has/1).
:- dynamic(no/1).
:- dynamic(chance/2).
:- dynamic(diagnosis/2).

diagnose(Person):-
	% Assert preliminary facts like gender, age, temperature, etc.

	% Preliminary questions are done, proceed asking about has symptoms
	findall(Disease,diag(Disease),_),
	findMostLikely(_,MostLikelyList),
	assert(diagnosis(Person,MostLikelyList)),
	undo.

setAge(X):-
	(( X< 6 -> assert(age(infant)));
	((X>5 , X<60)-> assert(age(normal)));
	(X > 59 -> assert(age(old)))).
setGender(Y):-
	((Y==m -> assert(gender(male)));
	(Y==f-> assert(gender(female)))).
setBodyTemp(Z):-
	(Z>=38 -> assert(has(fever));
	Z<38 -> assert(no(fever))).
setBloodPressure(X-Y):-
	(X>=130,Y>=80) -> assert(has(high_blood)); %high blood
	assert(no(high_blood)).
setBmi( Height,Weight):-
	BMI is Weight/Height^2,
	(BMI >30 -> assert(has(obese));
	assert(no(obsese))).

diag(hiv):- hiv, !.
diag(tubercolosis):-tubercolosis,!.
diag(bacterial_pneumonia):- bacterial_pneumonia,!.
diag(measles):- measles,!.
diag(hypertension):- hypertension, !.
diag(gastroenteritis):-gastroenteritis,!.
diag(dengue):-dengue,!.
diag(uti):- uti,!.
diag(diabetes):- diabetes,!.
diag(breast_cancer):-breast_cancer,!.

chance(hiv,100).
chance(tubercolosis,100).
chance(bacterial_pneumonia,100).
chance(measles,100).
chance(hypertension,100).
chance(gastroenteritis,100).
chance(dengue,100).
chance(uti,100).
chance(diabetes,100).
chance(breast_cancer,100).


hiv:-
	(has(fever); (no(fever) -> updateChance(hiv,10))),
	(has(weight_loss);(no(weight_loss)->updateChance(hiv,10))),

	(has(white_spot); (no(white_spot)->updateChance(hiv,10))),
	(has(purple_patch);(no(purple_patch)->updateChance(hiv,10))),
	(has(fatigue);(no(fatigue)->updateChance(hiv,10))),
	(has(muscle_ache);(no(muscle_ache)->updateChance(hiv,10))),
	(has(exposed); (no(exposed)->updateChance(hiv,10))),
	(has(swole_lymph_nodes); (no(swole_lymph_nodes)->updateChance(hiv,10))),
	(has(multi_infections); (no(multi_infections)->updateChance(hiv,10))),
	(has(unsafe_sex); (no(unsafe_sex)->updateChance(hiv,5))),
	(has(unprotected); (no(unprotected)->updateChance(hiv,5))),
	(has(multiple_partners);(no(multiple_partners)->updateChance(hiv,5))),
	(has(needle_accident);(no(needle_accident)->updateChance(hiv,5))),
	(has(drug_shared);(no(drug_shared)->updateChance(hiv,5))),
	((gender(male)->has(msm)); (no(msm)->updateChance(hiv,2))).

tubercolosis:-
	(has(weight_loss);(no(weight_loss)->updateChance(tubercolosis,25))),
	(has(cough);(no(cough)->updateChance(tubercolosis,25))),
	(has(afternoon_sweats);(no(afternoon_sweats)->updateChance(tubercolosis,25))),
	(has(swole_lymph_nodes);(no(swole_lymph_nodes)->updateChance(tubercolosis,25))).

bacterial_pneumonia:-
	(has(fever); (no(fever) -> updateChance(bacterial_pneumonia,10))),
	(has(mucus);(no(mucus)->updateChance(bacterial_pneumonia,30))),
	(has(fatigue);no(fatigue)->updateChance(bacterial_pneumonia,10)),
	(has(smoking);(no(smoking)->updateChance(bacterial_pneumonia,5))),
	(has(cough);(no(cough)->updateChance(bacterial_pneumonia,20))),
	(age(old);updateChance(bacterial_pneumonia,10)). %if cough -> chest pain


measles:-
	(has(fever); (no(fever) -> updateChance(measles,10))),
	(has(rash);(no(rash)->updateChance(measles,10))),
	(age(infant);(not(age(infant))->updateChance(measles,10))),
	(has(red_eyes);(no(red_eyes)->updateChance(measles,10))),
	(has(respiratory);(no(respiratory)->updateChance(measles,10))). %if runny nose
hypertension:-
	(has(high_blood);no(high_blood)->updateChance(hypertension,10)),
	(has(high_blood_family_history);(no(high_blood_family_history)->updateChance(hypertension,10))),
	(has(smoking);(no(smoking)->updateChance(hypertension,10))),
	(has(kidney);(no(kidney)->updateChance(hypertension,10))),
	(has(headache);(no(headache)->updateChance(hypertension,10))).
gastroenteritis:-
	(has(fever); (no(fever) -> updateChance(gastroenteritis,10))),
	(has(chills);(no(chills) -> updateChance(gastroenteritis,10))),
	(has(vomit);(no(vomit)->updateChance(gastroenteritis,10))),
	(has(nausea);(no(nausea)->updateChance(gastroenteritis,10))),
	(has(diarrhea);(no(diarrhea)->updateChance(gastroenteritis,10))),
	(has(abdominal);(no(abdominal)->updateChance(gastroenteritis,10))).
dengue:-
	(has(fever); (no(fever) -> updateChance(dengue,10))),
	(has(malaise);(no(malaise)->updateChance(dengue,10))), % if headches, eyepain or join pain, muscle or bone pain then malaise
	(has(rash);(no(rash)->updateChance(dengue,10))),
	(has(vomit);(no(vomit)->updateChance(dengue,10))),
	(has(nausea);(no(nausea)->updateChance(dengue,10))),
	(has(bleeding);(no(bleeding)->updateChance(dengue,10))).
uti:-
	(has(urge_to_urinate);(no(urge_to_urinate)->updateChance(uti,10))), %urge
	(has(burning_sensation);(no(burning_sensation)->updateChance(uti,10))),
	(has(small_urine);(no(small_urine)->updateChance(uti,10))),
	(has(fever); (no(fever) -> updateChance(uti,10))),
	(has(chills);(no(chills) -> updateChance(uti,10))),
	(has(uti_history);(no(uti_history)->updateChance(uti,5))). % not sure how to implement the history part

diabetes:-
	(has(obese);(no(obese)->updateChance(diabetes,10))),
	(has(thirst);(no(thirst)->updateChance(diabetes,10))),
	(has(weight_loss);(no(weight_loss)->updateChance(diabetes,10))),
	(has(hunger);(no(hunger)->updateChance(diabetes,10))),
	(has(high_blood);no(high_blood)->updateChance(diabetes,10)),


	(has(numbness);(no(numbness)->updateChance(diabetes,10))),
	(has(tingling);(no(tingling)->updateChance(diabetes,10))), %hands or feet
	(has(slow_healing);(no(slow_healing)->updateChance(diabetes,10))),
	(has(frequent_infection);(no(frequent_infection)->updateChance(diabertes,10))), %might move requent infection to the gathering of basic facts
	(has(fatigue);no(fatigue)->updateChance(hiv,10)),
	(has(blurred_vision);(no(blurred_vision)->updateChance(diabetes,10))),
	(has(sedentary);(no(sedentary)->updateChance(diabetes,10))),
	(has(diabetes_history);(no(diabetes_history)->updateChance(diabetes,10))).


breast_cancer:-
	(has(lumps);(no(lumps)->updateChance(breast_cancer,10))),%armpit
	(has(breast_change);(no(breast_change)->updateChance(breast_cancer,10))),
	(has(blood_discharge);(no(blood_discharge)->updateChance(breast_cancer,10))),
	(has(pain_nipple);(no(pain_nipple)->updateChance(breast_cancer,10))),

	(has(breast_cancer_history);(no(breast_cancer_history)->updateChance(breast_cancer,10))),
	(has(skin_texture);(no(skin_texture)->updateChance(breast_cancer,10))),
	(has(swole_lymph_nodes);no(swole_lymph_nodes)->updateChance(breast_cancer,10)).



updateChance(Disease, Subtract):-
	chance(Disease,Weight),
	X is Weight - Subtract,
	retract(chance(Disease,_)),
	assert(chance(Disease,X)),
	((X < 35) -> fail;true).
findMostLikely(DiseaseList,MostLikelyList):-
	findall(Prob-Disease,(chance(Disease,Prob),Prob>75),DiseaseList),
	keysort(DiseaseList,SortedDiseases),
	reverse(SortedDiseases,Descending),
	Descending = [MaxProb-_|_],
	findall(Prob-Disease,(chance(Disease,Prob),Prob == MaxProb),MostLikelyList).



undo :- retract(has(_)),fail.
undo :- retract(no(_)),fail.
undo :- retract(age(_)),fail.
undo :- retract(gender(_)),fail.
undo :- retract(chance(_,_)),fail.
undo.
`;

// ------------------ Prolog ------------------
interface Session {
	query(goal: string, arg1: { success: (goal: any) => void }): unknown;
	promiseAnswer(): unknown;
	promiseAnswers(): any;
	format_answer(answer: any): any;
	promiseConsult(arg0: string): unknown;
	promiseQuery(arg0: string): unknown;
	consult: (code: string) => void;
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
type Symptom = keyof typeof symptomQuestions;

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
	started: boolean;

	counter: number;
	indicators: (
		| Symptom
		| "needle_accident"
		| "drug_shared"
		| "travel"
		| "smoke"
		| "multiple_partners"
		| "unsure_protection"
		| "unsafe_sex_practices"
		| "msm"
		| "contaminated"
		| "measles_vaccination"
	)[];
	asked: Symptom[];
}

// ------------------ ChatBot ------------------
export default class ChatBot extends SapphireClient {
	pl: TauPrologInstance;
	session: Session;
	personalData: PersonalData;
	symptomQuestions: typeof symptomQuestions;
	symptomsPerDisease: typeof symptomsPerDisease;

	// Snowflake is a string, but it's a string of numbers.
	// ChatBot#sessions is a map of user IDs to their personal data.
	directory: Map<Snowflake, PersonalData>;
	container: any;

	constructor(options: ClientOptions) {
		super(options);

		container.util = require("../util/util");

		this.pl = require("tau-prolog");
		require("tau-prolog/modules/promises.js")(this.pl);

		this.session = this.pl.create({ limit: 1000 });
		this.symptomQuestions = symptomQuestions;
		this.symptomsPerDisease = symptomsPerDisease;
		this.directory = new Map();
	}

	async start() {}

	async getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[], user: PersonalData) {
		try {
			await this.session.promiseConsult(program);
		} catch (e) {
			console.error(e);
		}

		try {
			for (const symptom of confirmedSymptoms) {
				await this.session.promiseQuery(`assert(has(${symptom})).`);
			}

			for (const symptom of unconfirmedSymptoms) {
				await this.session.promiseQuery(`assert(no(${symptom})).`);
			}
		} catch (e) {
			console.error(e);
		}

		try {
			await this.session.promiseQuery("diagnosse(Patient).");
			await this.session.promiseQuery("diagnosis(Patient, X).");

			const diagnosis = await this.session.promiseAnswers();
			for await (const answer of diagnosis) {
				console.log(answer);
			}
		} catch (e) {
			console.error(e);
		}
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

		getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[], user: PersonalData): Promise<void>;
		setPersonalData(userInput: PersonalData): void;
		getPersonalData(): PersonalData;
	}
}
