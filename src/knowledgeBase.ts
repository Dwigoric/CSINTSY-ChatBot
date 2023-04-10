const program = `
:- use_module(library(lists)).

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
	assertz(diagnosis(Person,MostLikelyList)),
    undo,
    take(1, MostLikelyList, FirstDiagnosis),
	write(FirstDiagnosis).

setAge(X):-
	(( X< 6 -> assertz(age(infant)));
	((X>5 , X<60)-> assertz(age(normal)));
	(X > 59 -> assertz(age(old)))).
setGender(Y):-
	((Y==m -> assertz(gender(male)));
	(Y==f-> assertz(gender(female)))).
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
	(age(infant);(no(age(infant))->updateChance(measles,10))),
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
	assertz(chance(Disease,X)),
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

export default program;
