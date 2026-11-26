import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EvidenceCard from "../components/EvidenceCard";
import SuspectCard from "../components/SuspectCard";
import Timeline from "../components/Timeline";
import "../styles/investigation.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Investigation() {
    const { id } = useParams();
    const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("evidence");
  const [examinedEvidence, setExaminedEvidence] = useState([]);
  const [interrogatedSuspects, setInterrogatedSuspects] = useState([]);

  const handleExamine = (evidenceId) => {
    setExaminedEvidence((prev) =>
      prev.includes(evidenceId) ? prev : [...prev, evidenceId]
    );
  };

    const handleInterrogate = (suspectId) => {
        navigate(`/interrogation/${id}/${suspectId}`);
    };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setExaminedEvidence([]);
    setInterrogatedSuspects([]);
    setActiveTab("evidence");
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/cases/${id}`, { signal }),
      fetch(`${API_URL}/evidence?caseId=${id}`, { signal }),
      fetch(`${API_URL}/suspects?caseId=${id}`, { signal }),
      fetch(`${API_URL}/timeline?caseId=${id}`, { signal }),
    ])
      .then(async ([caseRes, evRes, suRes, tlRes]) => {
        if (!caseRes.ok) throw new Error("Cazul nu a fost găsit.");
        if (!evRes.ok || !suRes.ok || !tlRes.ok) throw new Error("Eroare la încărcarea datelor.");

        const [info, evidence, suspects, timeline] = await Promise.all([
          caseRes.json(),
          evRes.json(),
          suRes.json(),
          tlRes.json(),
        ]);

        setCaseData({
          ...info,
          evidence: Array.isArray(evidence) ? evidence : [],
          suspects: Array.isArray(suspects) ? suspects : [],
          timeline: Array.isArray(timeline) ? timeline : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <p className="investigation-message">Se încarcă cazul...</p>;
  }

  if (error) {
    return <p className="investigation-message">{error}</p>;
  }

  const evidence = caseData.evidence || [];
  const suspects = caseData.suspects || [];
  const timeline = caseData.timeline || [];

  return (
    <div className="investigation-page">
          <Link to="/cazuri" className="back-link">
              ← Înapoi la cazuri
          </Link>

      <h1>{caseData.title}</h1>

      <div className="investigation-progress">
        <span>
          Probe examinate: {examinedEvidence.length}/{evidence.length}
        </span>
        <span>
          Suspecți interogați: {interrogatedSuspects.length}/{suspects.length}
        </span>
      </div>

      <div className="investigation-tabs">
        <button
          className={activeTab === "evidence" ? "tab active" : "tab"}
          onClick={() => setActiveTab("evidence")}
        >
          Probe ({evidence.length})
        </button>

        <button
          className={activeTab === "suspects" ? "tab active" : "tab"}
          onClick={() => setActiveTab("suspects")}
        >
          Suspecți ({suspects.length})
        </button>

        <button
          className={activeTab === "timeline" ? "tab active" : "tab"}
          onClick={() => setActiveTab("timeline")}
        >
          Cronologie ({timeline.length})
        </button>
      </div>

      <div className="investigation-content">
        {activeTab === "evidence" && (
          <div className="cards-grid">
            {evidence.map((item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                isExamined={examinedEvidence.includes(item.id)}
                onExamine={() => handleExamine(item.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "suspects" && (
          <div className="cards-grid">
            {suspects.map((person) => (
              <SuspectCard
                key={person.id}
                suspect={person}
                isInterrogated={interrogatedSuspects.includes(person.id)}
                onInterrogate={() => handleInterrogate(person.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "timeline" && <Timeline events={timeline} />}
      </div>
    </div>
  );
}

export default Investigation;
