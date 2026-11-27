import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, UserRound } from "lucide-react";
import "../styles/finalAccusation.css";
import { DetectiveGate, readDetective } from "../components/DetectiveProfile";

function readProgress(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3002";
const SUSPECT_IMAGES = {
    "Edward Blackwood": "edward-blackwood",
    "Sarah Collins": "sarah-collins",
    "James Wilson": "james-wilson",
    "Elena Vance": "elena-vance",
    "Victor Marin": "victor-marin",
    "Arthur Doyle": "arthur-doyle",
    "Arthur Pendelton": "arthur-pendelton",
    "Luca Moretti": "luca-moretti",
    "George Vasile": "george-vasile",
};

const CASE_EXPLANATIONS = {
    "1": "Edward Blackwood a intrat în biroul lui Richard după ce fusese în grădină. Conflictul privind moștenirea a escaladat, iar Edward este responsabil de moartea fratelui său. Amprenta din birou contrazice alibiul, iar urmele de noroi confirmă trecerea prin grădină. Paharul o leagă pe Sarah de o vizită anterioară, iar scrisoarea dezvăluie șantajul lui James, nu vinovăția lor.",
    "2": "Arthur Doyle a organizat dispariția lui Thomas Miller pentru a evita consecințele problemelor financiare comune. Thomas a participat voluntar. Pașaportul fals și biletele din valiză indică planul. Elena cumpărase un bilet fără să cunoască întregul plan, iar ceasul lui Victor contrazice alibiul acestuia și ascunde neglijența sa. Nu există o confirmare a unei crime.",
    "3": "Arthur Pendelton a organizat furtul tabloului pentru câștig financiar și a dezactivat intenționat alarma. Jurnalul sistemului contrazice declarația sa. Luca intrase fără permisiune în sala principală și își rupsese mănușa atingând rama, iar George își achitase datoriile prin amanetarea bunurilor personale. Aceste indicii nu îi fac responsabili de furt."
};

function FinalAccusation() {
    const { id } = useParams();
    return <DetectiveGate><AccusationSession key={id} id={id} /></DetectiveGate>;
}

function AccusationSession({ id }) {
    const [caseData, setCaseData] = useState(null);
    const [suspects, setSuspects] = useState([]);
    const [selectedSuspect, setSelectedSuspect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const resultKey = `crimelab:verdict:${id}`;
    const [result, setResult] = useState(() => {
        try { return JSON.parse(localStorage.getItem(resultKey)); } catch { return null; }
    });
    const [confirmation, setConfirmation] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        const caseId = encodeURIComponent(id);
        Promise.all([
            fetch(`${API_URL}/cases/${caseId}`, { signal }),
            fetch(`${API_URL}/suspects?caseId=${caseId}`, { signal }),
        ]).then(async ([caseRes, suspectsRes]) => {
            if (!caseRes.ok || !suspectsRes.ok) throw new Error("Datele investigației nu au putut fi încărcate.");
            const [info, people] = await Promise.all([caseRes.json(), suspectsRes.json()]);
            if (signal.aborted) return;
            setCaseData(info);
            setSuspects(Array.isArray(people) ? people.filter(person => String(person.caseId) === String(id)) : []);
            setLoading(false);
        }).catch(err => {
            if (signal.aborted) return;
            setError(err.message);
            setLoading(false);
        });
        return () => controller.abort();
    }, [id]);

    const handleConfirm = async () => {
        if (!selectedSuspect || result || submitting) return;
        if (!window.confirm(`Confirmi acuzația definitivă împotriva suspectului ${selectedSuspect.name}?`)) return;
        setSubmitting(true);
        setConfirmation("");
        try {
            const response = await fetch(`${AI_URL}/api/accusation`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId: String(id), suspectId: String(selectedSuspect.id), detective: readDetective(), progress: { examinedEvidence: readProgress(`crimelab:evidence:${id}`), sessions: Object.fromEntries(suspects.map(person => { const saved = readProgress(`crimelab:interrogation:${id}:${person.id}`); return [String(person.id), { attempts: saved?.attempts, disclosureIds: saved?.disclosureIds, presentedEvidenceIds: saved?.presentedEvidenceIds }]; })) } })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Eroare la validare.");
            if (typeof data.correct !== "boolean" || data.caseId !== String(id) || !Number.isInteger(data.score) || data.score < 0 || data.score > 1000) throw new Error("Verdict invalid.");
            localStorage.setItem(resultKey, JSON.stringify(data));
            setResult(data);
        } catch (err) { setConfirmation(err.message); }
        finally { setSubmitting(false); }
    };

    if (loading) return <p className="accusation-message">Se pregătește dosarul final...</p>;
    if (error || !caseData) return <div className="accusation-message"><p>{error || "Cazul nu a fost găsit."}</p><Link to={`/investigation/${id}`}>Înapoi la investigație</Link></div>;

    if (result) return <section className="accusation-page"><div className="accusation-intro"><h1 style={{ color: result.correct ? "#22c55e" : "#ef4444" }}>{result.correct ? "CAZ REZOLVAT" : "CAZ EȘUAT"}</h1><h2>{caseData.title}</h2><p>Suspect acuzat: {result.suspectName}</p><p>{result.correct ? "Acuzația este corectă." : "Acuzația este greșită."}</p>{Number.isInteger(result.score) ? <div style={{ margin: "24px 0", padding: "24px", border: "1px solid #3f3f46", borderRadius: 12, width: "min(100%, 440px)" }}><h2>{result.score} / 1000 puncte</h2><h3>{result.rank}</h3>{Object.entries({ accusation: "Acuzație", evidence: "Probe", suspects: "Suspecți", confession: "Mărturisire", efficiency: "Eficiență" }).map(([key, label]) => <p key={key} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>{label}</span><strong>+{result.breakdown?.[key] ?? 0}</strong></p>)}</div> : <p>Verdict anterior sistemului de punctaj. Reîncepe cazul pentru a obține un scor.</p>}{result.correct && CASE_EXPLANATIONS[id] && <div style={{ margin: "24px 0", padding: "24px", border: "1px solid #3f3f46", borderRadius: 12, width: "min(100%, 680px)", textAlign: "left" }}><h2>Explicația misterului</h2><p style={{ lineHeight: 1.7 }}>{CASE_EXPLANATIONS[id]}</p></div>}<Link className="accusation-back" to={`/investigation/${id}`}>Înapoi la investigație</Link></div></section>;
    return (
        <section className="accusation-page">
            <header className="accusation-header">
                <Link to={`/investigation/${id}`} className="accusation-back"><ArrowLeft size={18} /> Continuă investigația</Link>
                <span className="accusation-file-number">CRIMELAB / DOSAR NR. {String(id).padStart(3, "0")}</span>
            </header>
            <div className="accusation-intro">
                <div className="accusation-emblem"><ShieldAlert size={38} /></div>
                <span className="accusation-eyebrow">ETAPA FINALĂ A INVESTIGAȚIEI</span>
                <h1>Acuzația finală</h1>
                <h2>{caseData.title}</h2>
                <p>Analizează informațiile obținute și identifică suspectul pe care îl consideri responsabil.</p>
            </div>
            <div className="accusation-suspects">
                {suspects.map(person => {
                    const isSelected = selectedSuspect?.id === person.id;
                    return (
                        <button type="button" key={person.id} className={`accusation-suspect-card ${isSelected ? "selected" : ""}`} disabled={submitting} aria-pressed={isSelected} onClick={() => { setSelectedSuspect(person); setConfirmation(""); }}>
                            <div className="accusation-portrait">
                                <span className="accusation-suspect-number">SUSPECT {String(person.id).padStart(2, "0")}</span>
                                {SUSPECT_IMAGES[person.name] ? <img src={`/images/interrogation/suspects/${SUSPECT_IMAGES[person.name]}.png`} alt={person.name} /> : <UserRound size={80} />}
                                {isSelected && <span className="accusation-selected-icon"><CheckCircle2 size={26} /></span>}
                            </div>
                            <div className="accusation-suspect-info">
                                <h3>{person.name}</h3>
                                <p>{person.description}</p>
                                <span className="accusation-selection-label">{isSelected ? "SUSPECT SELECTAT" : "SELECTEAZĂ SUSPECTUL"}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {!suspects.length && <p className="accusation-message">Nu există suspecți pentru acest caz.</p>}
            <div className="accusation-warning"><AlertTriangle size={26} /><div><strong>Atenție, detectiv!</strong><p>Acuzația finală va determina rezultatul investigației. Analizează cu atenție probele și declarațiile.</p></div></div>
            <div className="accusation-actions">
                <p>{selectedSuspect ? `Suspect selectat: ${selectedSuspect.name}` : "Niciun suspect selectat"}</p>
                <button type="button" className="accusation-confirm" disabled={!selectedSuspect || submitting} onClick={handleConfirm}><ShieldAlert size={21} /> Confirmă acuzația</button>
                {confirmation && <p style={{ color: "#ef4444" }} role="alert">{confirmation}</p>}
                <Link to={`/investigation/${id}`} className="accusation-back">Înapoi la investigație</Link>
            </div>
        </section>
    );
}

export default FinalAccusation;