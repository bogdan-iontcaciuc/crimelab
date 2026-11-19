function EvidenceCard({ evidence, isExamined = false, onExamine }) {
  return (
    <div className={isExamined ? "evidence-card examined" : "evidence-card"}>
      <div className="evidence-icon">{isExamined ? "✅" : "🔎"}</div>

      <div className="evidence-content">
        <span className="evidence-type">{evidence.type}</span>

        <h3>{evidence.name}</h3>

        <p>{evidence.description}</p>

        {isExamined ? (
          <div className="evidence-clue">
            <strong>Rezultatul examinării:</strong>
            <p>{evidence.clue || "Nu s-a descoperit nimic nou."}</p>
          </div>
        ) : (
          <button className="examine-btn" onClick={onExamine}>
            Examinează proba
          </button>
        )}
      </div>
    </div>
  );
}

export default EvidenceCard;
