import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EvidenceCard from "../components/EvidenceCard";
import SuspectCard from "../components/SuspectCard";
import Timeline from "../components/Timeline";
import "../styles/investigation.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function readProgress(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
}

function Investigation() {
    const { id } = useParams();
    return <InvestigationSession key={id} id={id} />;
}

function InvestigationSession({ id }) {
    const navigate = useNavigate();
    const evidenceKey = `crimelab:evidence:${id}`;
    const prefix = `crimelab:interrogation:${id}:`;
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("evidence");
    const [examinedEvidence, setExaminedEvidence] = useState(() => {
        const saved = readProgress(evidenceKey);
        return Array.isArray(saved) ? saved.map(String) : [];
    });
    const [interrogatedSuspects, setInterrogatedSuspects] = useState([]);

    const handleExamine = (evidenceId) => {
        const value = String(evidenceId);
        const next = examinedEvidence.includes(value) ? examinedEvidence : [...examinedEvidence, value];
        try {
            localStorage.setItem(evidenceKey, JSON.stringify(next));
            setExaminedEvidence(next);
        } catch { window.alert("Progresul nu a putut fi salvat."); }
    };

    const handleInterrogate = (suspectId) => navigate(`/interrogation/${id}/${suspectId}`);

    const handleRestart = () => {
        if (!window.confirm("Reîncepi investigația? Toate probele examinate și interogatoriile acestui caz vor fi resetate.")) return;
        try {
            Object.keys(localStorage).filter(key => key.startsWith(prefix)).forEach(key => localStorage.removeItem(key));
            localStorage.removeItem(evidenceKey);
            setExaminedEvidence([]);
            setInterrogatedSuspects([]);
            setActiveTab("evidence");
        } catch { window.alert("Progresul nu a putut fi resetat complet."); }
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        Promise.all([
            fetch(`${API_URL}/cases/${id}`, { signal }),
            fetch(`${API_URL}/evidence?caseId=${id}`, { signal }),
            fetch(`${API_URL}/suspects?caseId=${id}`, { signal }),
            fetch(`${API_URL}/timeline?caseId=${id}`, { signal }),
        ]).then(async ([caseRes, evRes, suRes, tlRes]) => {
            if (!caseRes.ok) throw new Error("Cazul nu a fost găsit.");
            if (!evRes.ok || !suRes.ok || !tlRes.ok) throw new Error("Eroare la încărcarea datelor.");
            const [info, evidence, suspects, timeline] = await Promise.all([caseRes.json(), evRes.json(), suRes.json(), tlRes.json()]);
            if (signal.aborted) return;
            const people = Array.isArray(suspects) ? suspects : [];
            setCaseData({ ...info, evidence: Array.isArray(evidence) ? evidence : [], suspects: people, timeline: Array.isArray(timeline) ? timeline : [] });
            setInterrogatedSuspects(people.filter(person => {
                const saved = readProgress(`${prefix}${person.id}`);
                return Array.isArray(saved?.messages) && saved.messages.some(message => message.role === "suspect");
            }).map(person => String(person.id)));
            setLoading(false);
        }).catch(err => {
            if (signal.aborted || err.name === "AbortError") return;
            setError(err.message);
            setLoading(false);
        });
        return () => controller.abort();
    }, [id, prefix]);

    if (loading) return <p className="investigation-message">Se încarcă cazul...</p>;
    if (error) return <p className="investigation-message">{error}</p>;
    const { evidence, suspects, timeline } = caseData;
    return (
        <div className="investigation-page">
            <div className="investigation-top-actions">
                <Link to="/cazuri" className="back-link">← Înapoi la cazuri</Link>
                <button type="button" className="investigation-restart" onClick={handleRestart}>↻ Reîncepe investigația</button>
            </div>
            <h1>{caseData.title}</h1>
            <div className="investigation-progress">
                <span>Probe examinate: {evidence.filter(item => examinedEvidence.includes(String(item.id))).length}/{evidence.length}</span>
                <span>Suspecți interogați: {interrogatedSuspects.length}/{suspects.length}</span>
            </div>
            <div className="investigation-tabs">
                <button className={activeTab === "evidence" ? "tab active" : "tab"} onClick={() => setActiveTab("evidence")}>Probe ({evidence.length})</button>
                <button className={activeTab === "suspects" ? "tab active" : "tab"} onClick={() => setActiveTab("suspects")}>Suspecți ({suspects.length})</button>
                <button className={activeTab === "timeline" ? "tab active" : "tab"} onClick={() => setActiveTab("timeline")}>Cronologie ({timeline.length})</button>
            </div>
            <div className="investigation-content">
                {activeTab === "evidence" && <div className="cards-grid">{evidence.map(item => <EvidenceCard key={item.id} evidence={item} isExamined={examinedEvidence.includes(String(item.id))} onExamine={() => handleExamine(item.id)} />)}</div>}
                {activeTab === "suspects" && <div className="cards-grid">{suspects.map(person => <SuspectCard key={person.id} suspect={person} isInterrogated={interrogatedSuspects.includes(String(person.id))} onInterrogate={() => handleInterrogate(person.id)} />)}</div>}
                {activeTab === "timeline" && <Timeline events={timeline} />}
            </div>
        </div>
    );
}

export default Investigation;