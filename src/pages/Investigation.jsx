import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EvidenceCard from "../components/EvidenceCard";
import SuspectCard from "../components/SuspectCard";
import Timeline from "../components/Timeline";
import "../styles/investigation.css";

const API_URL = "http://localhost:3001/cases";

function Investigation() {
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("evidence");
  const [examinedEvidence, setExaminedEvidence] = useState([]);

  const handleExamine = (evidenceId) => {
    setExaminedEvidence((prev) =>
      prev.includes(evidenceId) ? prev : [...prev, evidenceId]
    );
  };

  useEffect(() => {
    setExaminedEvidence([]);
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cazul nu a fost găsit.");
        return res.json();
      })
      .then((data) => {
        setCaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
      <Link to={`/cases/${id}`} className="back-link">
        ← Înapoi la detaliile cazului
      </Link>

      <h1>{caseData.title}</h1>

      <div className="investigation-progress">
        Probe examinate: {examinedEvidence.length}/{evidence.length}
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
              <SuspectCard key={person.id} suspect={person} />
            ))}
          </div>
        )}

        {activeTab === "timeline" && <Timeline events={timeline} />}
      </div>
    </div>
  );
}

export default Investigation;
