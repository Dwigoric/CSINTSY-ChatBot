import { container } from "@sapphire/framework";

type Disease = keyof typeof container.client.symptomsPerDisease;
function parseDiseaseSymptoms(disease: Disease) {
	const { symptomsPerDisease, symptomQuestions } = container.client;
	const symptoms = symptomsPerDisease[disease];

	return symptoms.map((symptom: keyof typeof symptomQuestions) => {
		return {
			label: symptom,
			value: symptom,
			description: symptomQuestions[symptom]
		}
	});
}

export {
	parseDiseaseSymptoms
}
