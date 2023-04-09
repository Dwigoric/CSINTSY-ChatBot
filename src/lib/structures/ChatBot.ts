import { container, SapphireClient } from "@sapphire/framework";
import { ClientOptions, Snowflake } from "discord.js";

import program from "../../knowledgeBase";
const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);

const session = pl.create({ limit: 1000 });

// ------------------ Prolog ------------------
interface Session {
    answers(arg0: (answer: any) => void): unknown;
    answer(arg0: { success: (answer: any) => void }): unknown;
    query(goal: string, arg1: { success: (goal: any) => void; error: (err: any) => void }): unknown;
    promiseAnswer(): Promise<void>;
    promiseAnswers(): any;
    format_answer(answer: any): any;
    promiseConsult(arg0: string): unknown;
    promiseQuery(arg0: string): unknown;
    consult: (code: string, arg1: Object) => unknown;
}

interface TauPrologInstance {
    type: any;
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
    diagnosis: {
        disease: string | undefined;
        certainty: string | undefined;
    };
}

// ------------------ ChatBot ------------------
export default class ChatBot extends SapphireClient {
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

        this.symptomQuestions = symptomQuestions;
        this.symptomsPerDisease = symptomsPerDisease;
        this.directory = new Map();
    }

    async start() {}

    async getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[], user: PersonalData, userId: string) {
        let queryString = "";

        const ageGoal = `setAge(${user.age}).`;
        const genderGoal = `setGender(${user.biologicalSex}).`;
        const bodyTempGoal = `setBodyTemp(${user.bodyTemperature}).`;
        const bloodPressureGoal = `setBloodPressure(${user.systolicBloodPressure}-${user.diastolicBloodPressure}).`;
        const bmiGoal = `setBmi(${user.height},${user.weight}).`;

        queryString += ageGoal + genderGoal + bodyTempGoal + bloodPressureGoal + bmiGoal;

        for (const symptom of confirmedSymptoms) {
            const goal = `assertz(has(${symptom})).`;
            queryString += goal;
        }
        for (const symptom of unconfirmedSymptoms) {
            const goal = `assertz(no(${symptom})).`;
            queryString += goal;
        }

        try {
            queryString += `diagnose(Patient).diagnosis(Patient,X).`;

            // await session.promiseConsult(program);
            // const answer = await session.promiseAnswer(await session.promiseQuery(queryString));
            // console.log(session.format_answer(answer));

            let personalData = this.directory.get(userId)!;

            session.consult(program, {
                success: () => {
                    session.query(queryString, {
                        success: () => {
                            session.answer({
                                success: (answer: any) => {
                                    let diagnosis = session.format_answer(answer);
                                    console.log(`Raw string: ${diagnosis}`);

                                    const matches = diagnosis.match(/\[(.*?)\]/);
                                    if (matches) diagnosis = matches[1];
                                    console.log(`Formatted: ${diagnosis}`);

                                    diagnosis = diagnosis.split(",")[0]; // get the first diagnosis
                                    const disease = diagnosis.split("-")[1];
                                    console.log(`Disease: ${disease}`);

                                    const certainty = diagnosis.split("-")[0];
                                    console.log(`Certainty: ${certainty}`);

                                    personalData.diagnosis = {
                                        disease: disease,
                                        certainty: certainty,
                                    };

                                    this.directory.set(userId, personalData);
                                },
                            });
                        },
                    });
                },
            });

            // await this.session.promiseConsult(program);
            // await this.session.promiseQuery(queryString);

            // this.session.query(queryString, {
            // 	success: function (goal) {
            // 		console.log(`Goal queried successfully: ${goal}`);

            // 		this.session.answer({
            // 			success: function (answer: any) {
            // 				console.log(`Answer: ${answer}`);
            // 			},
            // 			error: function (err: any) {
            // 				console.log(`Error: ${err}`);
            // 			},
            // 			fail: function () {
            // 				console.log(`Fail`);
            // 			},
            // 			limit: function () {
            // 				console.log(`Limit`);
            // 			},
            // 		});
            // 	},
            // 	error: function (err: any) {
            // 		console.log(`Error in querying goal: ${err}`);
            // 	},
            // });

            // this.session.query(queryString, {
            // 	success: (answer: any) => {
            // 		this.session.query(`diagnosis(Patient,X), write(X).`, {
            // 			success: (answer: any) => {
            // 				console.log(this.session.format_answer(answer));
            // 			},
            // 		});
            // 	},
            // });

            // for await (const answer of this.session.promiseAnswers()) console.log(this.session.format_answer(answer));

            // var show = (name: string, answers: any) => {
            // 	if (this.pl.type.is_substitution(answers)) {
            // 		let disease = answers.lookup("X");
            // 		console.log(`${name} may have ${disease}.`);
            // 	}
            // };

            // this.session.answers((answers) => {
            // 	show("Patient", answers);
            // });

            // this.session.answer({
            // 	success: function (answer) {
            // 		show(answer); // X = apple ;
            // 		this.session.answer({
            // 			success: function (answer: any) {
            // 				show(answer); // X = banana ;
            // 			},
            // 			// error, fail, limit
            // 		});
            // 	},
            // 	// error, fail, limit
            // });
        } catch (e) {
            console.error(`Error in diagnosing: ${e}`);
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

        getDiagnosis(confirmedSymptoms: string[], unconfirmedSymptoms: string[], user: PersonalData, userId: string): Promise<void>;
        setPersonalData(userInput: PersonalData): void;
        getPersonalData(): PersonalData;
    }
}
