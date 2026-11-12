
function EvidenceCard({ evidence }) {
  return (
    <div className="evidence-card">
      <div className="evidence-icon">🔎</div>

      <div className="evidence-content">
        <span className="evidence-type">
          {evidence.type}
        </span>

        <h3>{evidence.name}</h3>

        <p>{evidence.description}</p>
      </div>
    </div>
  );
}

export default EvidenceCard;
