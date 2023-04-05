go:-
    checkfor(Disease),
    write('You most likely have a'), write(Disease), nl,
    undo.
checkfor(hiv):- hiv, !.
checkfor(tubercolosis):-tubercolosis,!.
checkfor(bacterialpneumonia):- bacterialpneumonia,!.
checkfor(measles):- measles,!.

hiv:-
    verify(fever),
    verify(whitepatches),
    verify(unsafesex).
tubercolosis:-
    verify(weightloss),
    verify(cough),
    verify(afternoonsweats).
bacterialpneumonia:-
    verify(fever),
    verify(mucus),
    verify(fatigue),
    verify(smoking).
measles:-
    verify(fever),
    verify(cough),
    verify(rash).

ask(Question):-
    write('Does the patient experience: '),
    write(Question),
    write('?'),
    read(Response), nl,
    ((Response == yes; Response ==y)
    ->
    assert(yes(Question));
    assert(no(Question)), fail).

:- dynamic yes/1,no/1.

verify(Symptom):-
    (yes(Symptom)
    ->
    true ;
    (no(Symptom)
    ->
    fail;
    ask(Symptom))).
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.

