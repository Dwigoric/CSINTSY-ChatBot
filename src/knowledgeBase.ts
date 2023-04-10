const program = `
:- use_module(library(lists)).

:- dynamic(age/1).
:- dynamic(gender/1).
:- dynamic(has/1).
:- dynamic(no/1).
:- dynamic(chance/2).
:- dynamic(diagnosis/2).

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

diagnose(Person):-
	% Assert preliminary facts like gender, age, temperature, etc.

	% Preliminary questions are done, proceed asking about has symptoms
	findall(Disease,diag(Disease),_),
	findMostLikely(_,MostLikelyList),
	assertz(diagnosis(Person,MostLikelyList)),
    take(1, MostLikelyList, FirstDiagnosis),
	write(FirstDiagnosis),
	undo.
	
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

setAge(X):-
	(( X< 6 -> assertz(age(infant)));
	((X>5 , X<60)-> assertz(age(normal)));
	(X > 59 -> assertz(age(old)))).
setGender(Y):-
	((Y==M -> assertz(gender(male)));
	(Y==F-> assertz(gender(female)))).
setBodyTemp(Z):-
	(Z>=38 -> assertz(has(fever));
	Z<38 -> assertz(no(fever))).
setBloodPressure(X-Y):-
	(X>=130,Y>=80) -> assertz(has(high_blood)); %high blood
	assertz(no(high_blood)).
setBmi(Height,Weight):-
	BMI is Weight/Height^2,
	(BMI >30 -> assertz(has(obese));
	assertz(no(obese))).


hiv:-
	(has(fever); (no(fever) -> updateChance(hiv,5))),
	(has(weight_loss);(no(weight_loss)->updateChance(hiv,5))),
	(has(white_spot_or_purple_patch); (no(white_spot_or_purple_patch)->updateChance(hiv,5))),
	(has(fatigue);(no(fatigue)->updateChance(hiv,5))),
	(has(muscle_ache);(no(muscle_ache)->updateChance(hiv,5))),
	(has(exposed); (no(exposed)->updateChance(hiv,5))),
	(has(swole_lymph_nodes); (no(swole_lymph_nodes)->updateChance(hiv,5))),
	(has(multi_infections); (no(multi_infections)->updateChance(hiv,10))),

	(has(unsure_protection); (no(unsure_protection)->updateChance(hiv,10))),
	(has(unsafe_sex_practices); (no(unsafe_sex_practices)->updateChance(hiv,15))),
	(has(unprotected); (no(unprotected)->updateChance(hiv,10))),
	(has(multiple_partners);(no(multiple_partners)->updateChance(hiv,15))),
	(has(needle_accident);(no(needle_accident)->updateChance(hiv,2))),
	(has(drug_shared);(no(drug_shared)->updateChance(hiv,1))),
	((gender(male)->has(msm)); (no(msm)->updateChance(hiv,2))).

tubercolosis:-
	(has(weight_loss);(no(weight_loss)->updateChance(tubercolosis,25))),
	(has(cough);(no(cough)->updateChance(tubercolosis,25))),
	(has(afternoon_sweats);(no(afternoon_sweats)->updateChance(tubercolosis,25))),
	(has(swole_lymph_nodes);(no(swole_lymph_nodes)->updateChance(tubercolosis,25))).

bacterial_pneumonia:-
	(has(fever); (no(fever) -> updateChance(bacterial_pneumonia,10))),
	(has(mucus);(no(mucus)->updateChance(bacterial_pneumonia,20))),
	(has(fatigue);no(fatigue)->updateChance(bacterial_pneumonia,10)),
	(has(smoking);(no(smoking)->updateChance(bacterial_pneumonia,20))),
	(has(cough);(no(cough)->updateChance(bacterial_pneumonia,20))),
	(age(old);updateChance(bacterial_pneumonia,10)),
	(has(shortness_of)breath);(no(shortness_of_breath)->updateChance(bacterial_pneumonia,10)).

measles:-
	(has(fever); (no(fever) -> updateChance(measles,20))),
	(has(rash);(no(rash)->updateChance(measles,25))),
	(age(infant);(no(age(infant))->updateChance(measles,10))),
	(has(red_eyes);(no(red_eyes)->updateChance(measles,15))),
	(has(respiratory);(no(respiratory)->updateChance(measles,20))),
	(has(measles_vaccination);(no(measles_vaccination)->updateChance(measles,10))).

hypertension:-
	(has(high_blood);no(high_blood)->updateChance(hypertension,30)),
	(has(high_blood_family_history);(no(high_blood_family_history)->updateChance(hypertension,25))),
	(has(smoking);(no(smoking)->updateChance(hypertension,15))),
	(has(kidney);(no(kidney)->updateChance(hypertension,15))),
	(has(headache);(no(headache)->updateChance(hypertension,15))).

gastroenteritis:-
	(has(fever); (no(fever) -> updateChance(gastroenteritis,5))),
	(has(chills);(no(chills) -> updateChance(gastroenteritis,5))),
	(has(nausea_or_vomiting);(no(nausea_or_vomiting)->updateChance(gastroenteritis,15))),
	(has(diarrhea);(no(diarrhea)->updateChance(gastroenteritis,20))),
	(has(abdominal);(no(abdominal)->updateChance(gastroenteritis,20))),
	(Has(travel);(no(travel)->updateChance(gastroenteritis,15))),
	(has(contaminated);(no(contaminated)->updateChance(gastroenteritis,20)))

dengue:-
	(has(fever); (no(fever) -> updateChance(dengue,10))),
	(has(malaise);(no(malaise)->updateChance(dengue,10))),
	(has(rash);(no(rash)->updateChance(dengue,10))),
	(has(vomit);(no(vomit)->updateChance(dengue,10))),
	(has(nausea);(no(nausea)->updateChance(dengue,10))),
	(has(bleeding);(no(bleeding)->updateChance(dengue,10))).

uti:-
	(has(urge_to_urinate);(no(urge_to_urinate)->updateChance(uti,25))),
	(has(burning_sensation);(no(burning_sensation)->updateChance(uti,20))),
	(has(small_urine);(no(small_urine)->updateChance(uti,25))),
	(has(dark_urine);(no(dark_urine)->updateChance(uti,10))),
	(has(fever); (no(fever) -> updateChance(uti,5))),
	(has(chills);(no(chills) -> updateChance(uti,5))),
	(has(uti_history);(no(uti_history)->updateChance(uti,10))). 

diabetes:-
	(has(obese);(no(obese)->updateChance(diabetes,15))),
	(has(thirst);(no(thirst)->updateChance(diabetes,5))),
	(has(weight_loss);(no(weight_loss)->updateChance(diabetes,10))),
	(has(hunger);(no(hunger)->updateChance(diabetes,5))),
	(has(high_blood);no(high_blood)->updateChance(diabetes,10)),
	(has(numbness);(no(numbness)->updateChance(diabetes,5))),


	(has(tingling);(no(tingling)->updateChance(diabetes,5))), %hands or feet
	(has(slow_healing);(no(slow_healing)->updateChance(diabetes,10))),
	(has(frequent_infection);(no(frequent_infection)->updateChance(diabertes,10))), %might move requent infection to the gathering of basic facts
	(has(fatigue);no(fatigue)->updateChance(hiv,5)),
	(has(blurred_vision);(no(blurred_vision)->updateChance(diabetes,5))),
	(has(sedentary);(no(sedentary)->updateChance(diabetes,5))),
	(has(diabetes_history);(no(diabetes_history)->updateChance(diabetes,10))).


breast_cancer:-
	(has(lumps);(no(lumps)->updateChance(breast_cancer,10))),%armpit
	(has(breast_change);(no(breast_change)->updateChance(breast_cancer,10))),
	(has(blood_discharge);(no(blood_discharge)->updateChance(breast_cancer,15))),
	(has(pain_nipple);(no(pain_nipple)->updateChance(breast_cancer,10))),

	(has(breast_cancer_history);(no(breast_cancer_history)->updateChance(breast_cancer,15))),
	(has(skin_texture);(no(skin_texture)->updateChance(breast_cancer,15))),
	(has(swole_lymph_nodes);no(swole_lymph_nodes)->updateChance(breast_cancer,15)).


updateChance(Disease, Subtract):-
	chance(Disease,Weight),
	X is Weight - Subtract,
	retract(chance(Disease,_)),
	assertz(chance(Disease,X)),
	((X < 75) -> fail;true).


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

export default program;
