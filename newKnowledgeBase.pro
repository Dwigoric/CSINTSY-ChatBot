:-dynamic age/1.
:-dynamic gender/1.
:-dynamic has/1,no/1.
:-dynamic chance/2. 
:-dynamic diagnosis/2.
%probability of the patient having a certain disease

diagnose(Person):-
    %introduction 
   /* write('Hi! I am Vita, a robot medical expert designed to help you diagnose your hastoms. '),
    write('While I am programmed to provide accurate diagnoses based on your input, I want to '),
    write('make it clear that my knowledge is limited to the information and algorithms provided to me. '),
    write('It is always recommended to seek the advice of a licensed medical professional for a comprehensive '),
    write('and accurate diagnosis. However, I will do my best to provide you with helpful information and guide you in the right direction.'),
    nl, nl, nl,*/
    % gather preliminary facts like gender, age, temperature
   

   % nl,nl, write('Now I will be asking you a series of questions that you will have to answer honestly.'),nl,nl,
    %preliminarie questions are done, proceed asking about hastoms
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
    (X>=130,Y>=80) -> assert(has(bloodpressure)); %high blood
    assert(no(bloodpressure)).
setBmi( Height,Weight):-
    BMI is Weight/Height^2,
    (BMI >30 -> assert(has(obese));
    assert(no(obsese))).

diag(hiv):- hiv, !.
diag(tubercolosis):-tubercolosis,!.
diag(bacterialpneumonia):- bacterialpneumonia,!.
diag(measles):- measles,!.
diag(hypertension):- hypertension, !.
diag(gastroenteritis):-gastroenteritis,!.
diag(dengue):-dengue,!.
diag(uti):- uti,!.
diag(diabetes):- diabetes,!.
diag(breastcancer):-breastcancer,!.

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
    (has(fever); (no(fever) -> updateChance(hiv,10))),
    (has(weightloss);(no(weightloss)->updateChance(hiv,10))),

    (has(whitespot); (no(whitespot)->updateChance(hiv,10))),
    (has(purplepatch);(no(purplepatch)->updateChance(hiv,10))),
    (has(fatigue);(no(fatigue)->updateChance(hiv,10))),
    (has(muscleache);(no(muscleache)->updateChance(hiv,10))),
    (has(exposed); (no(exposed)->updateChance(hiv,10))),
    (has(swollenlymphnodes); (no(swollenlymphnodes)->updateChance(hiv,10))),
    (has(multipleinfections); (no(multipleinfections)->updateChance(hiv,10))),
    (has(unsafesex); (no(unsafesex)->updateChance(hiv,5))),
    (has(unprotected); (no(unprotected)->updateChance(hiv,5))),
    ((gender(male)->has(msm)); (no(msm)->updateChance(hiv,2))).
    
tubercolosis:-
    (has(weightloss);(no(weightloss)->updateChance(tubercolosis,25))),
    (has(cough);(no(cough)->updateChance(tubercolosis,25))),
    (has(afternoonsweats);(no(afternoonsweats)->updateChance(tubercolosis,25))),
    (has(swollenlymphnodes);(no(swollenlymphnodes)->updateChance(tubercolosis,25))).

bacterialpneumonia:-
    (has(fever); (no(fever) -> updateChance(bacterialpneumonia,10))),
    (has(mucus);(no(mucus)->updateChance(bacterialpneumonia,30))),
    (has(fatigue);no(fatigue)->updateChance(bacterialpneumonia,10)), 
    (has(smoking);(no(smoking)->updateChance(bacterialpneumonia,5))),
    (has(cough);(no(cough)->updateChance(bacterialpneumonia,20))), 
    (age(old);updateChance(bacterialpneumonia,10)). %if cough -> chest pain
    

measles:-
    (has(fever); (no(fever) -> updateChance(measles,10))),
    (has(rash);(no(rash)->updateChance(measles,10))),
    (age(infant);(not(age(infant))->updateChance(measles,10))),
    (has(redeyes);(no(redeyes)->updateChance(measles,10))),
    (has(respiratory);(no(respiratory)->updateChance(measles,10))). %if runny nose
hypertension:-
    (has(bloodpressure);no(bloodpressure)->updateChance(hypertension,10)),
    (has(familyhistoryhighbp);(no(familyhistoryhighbp)->updateChance(hypertension,10))),
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
    (has(strongurgeurine);(no(strongurgeurine)->updateChance(uti,10))), %urge
    (has(burningsensation);(no(burningsensation)->updateChance(uti,10))),
    (has(smallurine);(no(smallurine)->updateChance(uti,10))),
    (has(fever); (no(fever) -> updateChance(uti,10))),
    (has(chills);(no(chills) -> updateChance(uti,10))),
    (has(utihistory);(no(utihistory)->updateChance(uti,5))). % not sure how to implement the history part

diabetes:-
    (has(obese);(no(obese)->updateChance(diabetes,10))),
    (has(thirst);(no(thirst)->updateChance(diabetes,10))),
    (has(weightloss);(no(weightloss)->updateChance(diabetes,10))),
    (has(hunger);(no(hunger)->updateChance(diabetes,10))),
    (has(bloodpressure);no(bloodpressure)->updateChance(diabetes,10)),

    
    (has(numbness);(no(numbness)->updateChance(diabetes,10))),
    (has(tingling);(no(tingling)->updateChance(diabetes,10))), %hands or feet
    (has(slowhealing);(no(slowhealing)->updateChance(diabetes,10))),
    (has(frequentinfection);(no(frequentinfection)->updateChance(diabertes,10))), %might move requent infection to the gathering of basic facts
    (has(fatigue);no(fatigue)->updateChance(hiv,10)),
    (has(blurredvision);(no(blurredvision)->updateChance(diabetes,10))),
    (has(physicallyinactive);(no(physicallyinactive)->updateChance(diabetes,10))),
    (has(diabeteshistory);(no(diabeteshistory)->updateChance(diabetes,10))).
    

breastcancer:- 
    (has(lumps);(no(lumps)->updateChance(breastcancer,10))),%armpit
    (has(breastchange);(no(breastchange)->updateChance(breastcancer,10))),
    (has(bloodydischarge);(no(bloodydischarge)->updateChance(breastcancer,10))),
    (has(painnipple);(no(painnipple)->updateChance(breastcancer,10))),
    
    (has(breastcancerhistory);(no(breastcancerhistory)->updateChance(breastcancer,10))),
    (has(skintexture);(no(skintexture)->updateChance(breastcancer,10))),
    (has(swollenlymphnodes);no(swollenlymphnodes)->updateChance(breastcancer,10)).



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

