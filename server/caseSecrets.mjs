const stage = (id, cooperation, evidence, reply) => ({ id, cooperation, evidence, reply });

export const CASE_SECRETS = new Map([
    ["1", [stage("1a", 50, ["2"], "Recunosc că am atins clanța biroului. Nu am spus adevărul despre asta."), stage("1b", 75, ["2"], "Am intrat în birou și m-am certat cu Richard din cauza moștenirii."), stage("1c", 90, ["2", "4"], "Conflictul cu Richard a degenerat. Eu sunt responsabil pentru moartea lui.")]],
    ["2", [stage("2a", 50, ["1"], "Recunosc că am intrat în birou înainte de crimă."), stage("2b", 75, ["1"], "Am ascuns vizita fiindcă mă temeam să nu fiu acuzată. Nu l-am ucis pe Richard.")]],
    ["3", [stage("3a", 50, ["3"], "Scrisoarea are legătură cu un conflict pe care l-am ascuns."), stage("3b", 75, ["3"], "Richard mă șantaja în legătură cu un secret din trecut. Nu l-am ucis.")]],
    ["4", [stage("4a", 50, ["5"], "Îl cunoșteam pe Thomas înainte de călătorie."), stage("4b", 75, ["5"], "Eu i-am cumpărat biletul, dar nu cunoșteam întregul plan al dispariției.")]],
    ["5", [stage("5a", 50, ["6"], "Nu am dormit pe toată durata pe care am declarat-o."), stage("5b", 75, ["6"], "Eram treaz în jurul orei 01:40. Am ascuns faptul că mi-am neglijat atribuțiile.")]],
    ["6", [stage("6a", 50, ["7"], "Problemele financiare dintre mine și Thomas erau mai serioase decât am recunoscut."), stage("6b", 70, ["7"], "Știam că Thomas intenționa să dispară de bunăvoie. Plecarea era planificată."), stage("6c", 80, ["7"], "Eu am organizat dispariția lui Thomas pentru a evita consecințele problemelor noastre financiare.")]],
    ["7", [stage("7a", 50, ["8"], "Recunosc că am folosit codul sistemului de securitate după ora declarată a plecării."), stage("7b", 70, ["8"], "Am dezactivat intenționat alarma galeriei."), stage("7c", 80, ["8"], "Eu am organizat furtul tabloului pentru câștig financiar.")]],
    ["8", [stage("8a", 50, ["9"], "Recunosc că am intrat în sala principală fără permisiune."), stage("8b", 75, ["9"], "Mi-am rupt mănușa atingând accidental rama. Am ascuns incidentul de teamă să nu-mi pierd slujba.")]],
    ["9", [stage("9a", 50, ["10"], "Recunosc că îmi achitasem datoriile înainte de furt."), stage("9b", 75, ["10"], "Am amanetat bunuri personale ca să îmi plătesc datoriile. Mi-a fost rușine să vorbesc despre asta.")]]
]);

export function getDisclosureProgress(suspectId, savedIds, evidenceIds, cooperation) {
    const stages = CASE_SECRETS.get(String(suspectId)) || [];
    const known = new Set(evidenceIds.map(String));
    const saved = new Set(Array.isArray(savedIds) ? savedIds.map(String) : []);
    const unlocked = Array();
    for (const item of stages) {
        if (!saved.has(item.id) || !item.evidence.every(id => known.has(id))) break;
        unlocked.push(item);
    }
    const next = stages[unlocked.length];
    const eligible = next && cooperation >= next.cooperation && next.evidence.every(id => known.has(id)) ? next : null;
    return { unlocked, eligible };
}