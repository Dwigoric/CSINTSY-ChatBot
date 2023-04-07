:-dynamic age/1.
:-dynamic gender/1.
:- dynamic has/1,no/1.
:-dynamic chance/2. %probability of the patient having a certain disease

go:-
    %introduction 
    write('Hi! I am Vita, a robot medical expert designed to help you diagnose your symptoms. '),
    write('While I am programmed to provide accurate diagnoses based on your input, I want to '),
    write('make it clear that my knowledge is limited to the information and algorithms provided to me. '),
    write('It is always recommended to seek the advice of a licensed medical professional for a comprehensive '),
    write('and accurate diagnosis. However, I will do my best to provide you with helpful information and guide you in the right direction.'),
    nl, nl, nl,
    % gather preliminary facts like gender, age, temperature
    askAge, askGender, askBodyTemp,askBloodPressure,askBMI,

    %di ko muna sinama ung family history sa preliminaries, mas maganda ata na last question un sa mga symptom na need un
    nl,nl, write('Now I will be asking you a series of questions that you will have to answer honestly.'),nl,nl,
    %preliminarie questions are done, proceed asking about symptoms
    findall(Disease,diag(Disease),_),
    findMostLikely(_,MostLikelyList),
    write('You most likely have a '), write(MostLikelyList),nl,
    undo.

askAge:-
    write('Please state your age: '),
    read(X), nl,
    (( X< 6 -> assert(age(infant)));
    ((X>5 , X<60)-> assert(age(normal)));
    (X > 59 -> assert(age(old)))).
askGender:-
    write('Please indicate your gender (m/f): '),
    read(Y),nl,
    ((Y==m -> assert(gender(male)));
    (Y==f-> assert(gender(female)))).
askBodyTemp:-
    write('Gather your bodytemperature with a termometer and please input your temperature in Celsius. '),
    read(Z),nl,
    (Z>=38 -> assert(has(fever));
    Z<38 -> assert(no(fever))).
askBloodPressure:-
    write('Please measure your blood pressure. (systolic,diastolic)'),
    read(I),nl,
    X-Y = I,
    ((X>=130,Y>=80) -> assert(has(bloodpressure)); %high blood
    assert(no(bloodpressure))).
askBMI:-
    write('height'),
    read(Height),nl,
    write('weight'),
    read(Weight),nl,
    BMI is Weight/Height^2,
    (BMI >30 -> assert(has(obese));
    assert(no(obsese))).

diag(hiv):- hiv.
diag(tubercolosis):-tubercolosis.
diag(bacterialpneumonia):- bacterialpneumonia.
diag(measles):- measles.
diag(hypertension):- hypertension.
diag(gastroenteritis):-gastroenteritis.
diag(dengue):-dengue.
diag(uti):- uti.
diag(diabetes):- diabetes.
diag(breastcancer):-breastcancer.

chance(hiv,100).
chance(tubercolosis,100).
chance(bacterialpneumonia,100).
chance(measles,100).
chance(hypertension,100).
chance(gastroenteritis,100).
chance(dengue,100).
chance(uti,100).
chance(diabetes,100).
chance(breastcancer,100).


hiv:-
    (symp(fever); (no(fever) -> updateChance(hiv,10))),
    (symp(weightloss);(no(weightloss)->updateChance(hiv,10))),

    (symp(whitespot); (no(whitespot)->updateChance(hiv,10))),
    (symp(purplepatch);(no(purplepatch)->updateChance(hiv,10))),
    (symp(fatigue);(no(fatigue)->updateChance(hiv,10))),
    (symp(muscleache);(no(muscleache)->updateChance(hiv,10))),
    (symp(exposed); (no(exposed)->updateChance(hiv,10))),
    (symp(swollenlymphnodes); (no(swollenlymphnodes)->updateChance(hiv,10))),
    (symp(multipleinfections); (no(multipleinfections)->updateChance(hiv,10))),
    (symp(unsafesex); (no(unsafesex)->updateChance(hiv,5))),
    (symp(unprotected); (no(unprotected)->updateChance(hiv,5))),
    ((gender(male)->symp(msm)); (no(msm)->updateChance(hiv,2))).
    
tubercolosis:-
    (symp(weightloss);(no(weightloss)->updateChance(tubercolosis,25))),
    (symp(cough);(no(cough)->updateChance(tubercolosis,25))),
    (symp(afternoonsweats);(no(afternoonsweats)->updateChance(tubercolosis,25))),
    (symp(swollenlymphnodes);(no(swollenlymphnodes)->updateChance(tubercolosis,25))).

bacterialpneumonia:-
    (symp(fever); (no(fever) -> updateChance(bacterialpneumonia,10))),
    (symp(mucus);(no(mucus)->updateChance(bacterialpneumonia,30))),
    (symp(fatigue);no(fatigue)->updateChance(bacterialpneumonia,10)), 
    (symp(smoking);(no(smoking)->updateChance(bacterialpneumonia,5))),
    (symp(cough);(no(cough)->updateChance(bacterialpneumonia,20))), 
    (age(old);updateChance(bacterialpneumonia,10)). %if cough -> chest pain
    

measles:-
    (symp(fever); (no(fever) -> updateChance(measles,10))),
    (symp(rash);(no(rash)->updateChance(measles,10))),
    (age(infant);(not(age(infant))->updateChance(measles,10))),
    (symp(redeyes);(no(redeyes)->updateChance(measles,10))),
    (symp(respiratory);(no(respiratory)->updateChance(measles,10))). %if runny nose
hypertension:-
    (symp(bloodpressure);no(bloodpressure)->updateChance(hypertension,10)),
    (symp(familyhistoryhighbp);(no(familyhistoryhighbp)->updateChance(hypertension,10))),
    (symp(smoking);(no(smoking)->updateChance(hypertension,10))),
    (symp(kidney);(no(kidney)->updateChance(hypertension,10))),
    (symp(headache);(no(headache)->updateChance(hypertension,10))).
gastroenteritis:-
    (symp(fever); (no(fever) -> updateChance(gastroenteritis,10))),
    (symp(chills);(no(chills) -> updateChance(gastroenteritis,10))),
    (symp(vomit);(no(vomit)->updateChance(gastroenteritis,10))),
    (symp(nausea);(no(nausea)->updateChance(gastroenteritis,10))),
    (symp(diarrhea);(no(diarrhea)->updateChance(gastroenteritis,10))),
    (symp(abdominal);(no(abdominal)->updateChance(gastroenteritis,10))).
dengue:-
    (symp(fever); (no(fever) -> updateChance(dengue,10))),
    (symp(malaise);(no(malaise)->updateChance(dengue,10))), % if headches, eyepain or join pain, muscle or bone pain then malaise
    (symp(rash);(no(rash)->updateChance(dengue,10))),
    (symp(vomit);(no(vomit)->updateChance(dengue,10))),
    (symp(nausea);(no(nausea)->updateChance(dengue,10))),
    (symp(bleeding);(no(bleeding)->updateChance(dengue,10))).
uti:-
    (symp(strongurgeurine);(no(strongurgeurine)->updateChance(uti,10))), %urge
    (symp(burningsensation);(no(burningsensation)->updateChance(uti,10))),
    (symp(smallurine);(no(smallurine)->updateChance(uti,10))),
    (symp(fever); (no(fever) -> updateChance(uti,10))),
    (symp(chills);(no(chills) -> updateChance(uti,10))),
    (symp(utihistory);(no(utihistory)->updateChance(uti,5))). % not sure how to implement the history part

diabetes:-
    (symp(obese);(no(obese)->updateChance(diabetes,10))),
    (symp(thirst);(no(thirst)->updateChance(diabetes,10))),
    (symp(weightloss);(no(weightloss)->updateChance(diabetes,10))),
    (symp(hunger);(no(hunger)->updateChance(diabetes,10))),
    (symp(bloodpressure);no(bloodpressure)->updateChance(diabetes,10)),

    
    (symp(numbness);(no(numbness)->updateChance(diabetes,10))),
    (symp(tingling);(no(tingling)->updateChance(diabetes,10))), %hands or feet
    (symp(slowhealing);(no(slowhealing)->updateChance(diabetes,10))),
    (symp(frequentinfection);(no(frequentinfection)->updateChance(diabertes,10))), %might move requent infection to the gathering of basic facts
    (symp(fatigue);no(fatigue)->updateChance(hiv,10)),
    (symp(blurredvision);(no(blurredvision)->updateChance(diabetes,10))),
    (symp(physicallyinactive);(no(physicallyinactive)->updateChance(diabetes,10))),
    (symp(diabeteshistory);(no(diabeteshistory)->updateChance(diabetes,10))).
    

breastcancer:- 
    (symp(lumps);(no(lumps)->updateChance(breastcancer,10))),%armpit
    (symp(breastchange);(no(breastchange)->updateChance(breastcancer,10))),
    (symp(bloodydischarge);(no(bloodydischarge)->updateChance(breastcancer,10))),
    (symp(painnipple);(no(painnipple)->updateChance(breastcancer,10))),
    
    (symp(breastcancerhistory);(no(breastcancerhistory)->updateChance(breastcancer,10))),
    (symp(skintexture);(no(skintexture)->updateChance(breastcancer,10))),
    (symp(swollenlymphnodes);no(swollenlymphnodes)->updateChance(breastcancer,10)).


ask(Question):-
    write(Question),
    read(Response), nl,
    ((Response == yes; Response ==y)
    ->
    assert(has(Question));
    assert(no(Question)),
    fail).


symp(Symptom):-
    (has(Symptom)
    ->
    true ;
    (no(Symptom)
    ->
    fail;
    ask(Symptom))).

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

