:-dynamic age/1.
:-dynamic gender/1.
:- dynamic has/1,no/1.

go:-
    %introduction 
    write('Hi! I am Vita, a robot medical expert designed to help you diagnose your symptoms. '),
    write('While I am programmed to provide accurate diagnoses based on your input, I want to '),
    write('make it clear that my knowledge is limited to the information and algorithms provided to me. '),
    write('It is always recommended to seek the advice of a licensed medical professional for a comprehensive '),
    write('and accurate diagnosis. However, I will do my best to provide you with helpful information and guide you in the right direction.'),
    nl, nl, nl,
    % gather preliminary facts like gender, age, temperature
    write('Please state your age: '),
    read(X), nl,
    (( X< 6 -> assert(age(infant)));
    ((X>5 , X<60)-> assert(age(normal)));
    (X > 59 -> assert(age(old)))),

    write('Please indicate your gender (m/f): '),
    read(Y),nl,
    ((Y==m -> assert(gender(male)));
    (Y==f-> assert(gender(female)))),

    write('Gather your bodytemperature with a termometer and please input your temperature in Celsius. '),
    read(Z),nl,
    (Z>=38 -> assert(has(fever));
    Z<38 -> assert(no(fever))),

    write('Please measure your blood pressure. '),
    read(I),nl,
    (I>=140 -> assert(has(bloodpressure)); %high blood
    assert(no(bloodpressure))),

    write('Please indicate your BMI. Note the formula is: weight in kilos / height^2 in meters.'),
    read(J),nl,
    (J >30 -> assert(has(obese));
    assert(no(obsese))),

    %di ko muna sinama ung family history sa preliminaries, mas maganda ata na last question un sa mga symptom na need un
    nl,nl, write('Now I will be asking you a series of questions that you will have to answer honestly.'),nl,nl,
    %preliminarie questions are done, proceed asking about symptoms
    diag(Disease),
    write('You most likely have a '), write(Disease), nl,
    undo.


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




hiv:-
    \+(age(infant)),
    symp(fever),
    symp(weightloss),
    (symp(whitespot); symp(purplepatch)),
    symp(fatigue),  %binreak apart ko ung flulike symptoms since ung ibang symptoms under nito nagoverlap sa ibang disease
    symp(muscleache),
    symp(exposed),
    symp(swollenlymphnodes),
    symp(multipleinfections), %pinagsama ko nalang tong multiple infections 
    (symp(unsafesex); 
    symp(unprotected);
    gender(male)->symp(msm)).
    
tubercolosis:-
    symp(weightloss),
    symp(cough),
    symp(afternoonsweats),
    symp(swollenlymphnodes).
bacterialpneumonia:-

    symp(fever),
    symp(mucus),
    symp(fatigue),
    symp(smoking),
    symp(cough), %high risk ((highrisk1 or high risk 2 or...) and lowrisk)
     % another implementation might be if(highrisk1 or highrisk2 or ...) -> suggest more test
    age(old). %if cough -> chest pain
    

measles:-
    symp(fever),
    symp(rash),
    age(infant),
    symp(redeyes),
    symp(respiratory). %if runny nose
hypertension:-
    symp(bloodpressure),
    symp(familyhistory),
    symp(smoking),
    symp(kidney),
    symp(headache).
gastroenteritis:-
    (symp(fever);symp(chills)),
    (symp(vomit);symp(nausea)),
    symp(diarrhea),
    symp(abdominal).
dengue:-
    symp(fever),
    symp(malaise), % if headches, eyepain or join pain, muscle or bone pain then malaise
    symp(rash),
    (symp(vomit); symp(nausea)),
    symp(bleeding).
uti:-
    symp(strongurgeurine), %urge
    symp(burningsenseation),
    symp(smallurine),
    (symp(fever);symp(chills);
   symp(utihistory)). % not sure how to implement the history part

diabetes:-
    symp(obese),
    symp(thirst),
    symp(weightloss),
    symp(hunger),
    symp(bloodpressure),

    (
    (symp(numbness);symp(tingling)); %hands or feet
    (symp(slowhealing);symp(frequentinfection)); %might move requent infection to the gathering of basic facts
    symp(fatigue);
    symp(blurredvision);
    symp(physicallyinactive);
    symp(diabeteshistory)
    ).
    

breastcancer:- 
    symp(lumps),%armpit
    symp(breastchange),
    symp(bloodydischarge),
    symp(painnipple),
    (
    symp(familyhistory);
    symp(skintexture);
    symp(swollenlymphnodes)
    ).


ask(Question):-
    write(Question),
    read(Response), nl,
    ((Response == yes; Response ==y)
    ->
    assert(has(Question));
    assert(no(Question)),
    fail).


%general method
symp(Symptom):-
    (has(Symptom)
    ->
    true ;
    (no(Symptom)
    ->
    fail;
    ask(Symptom))).

undo :- retract(has(_)),fail.
undo :- retract(no(_)),fail.
undo :- retract(age(_)),fail.
undo :- retract(gender(_)),fail.
undo.

