function SuspectCard({ suspect, isInterrogated = false, onInterrogate }) {
  return (
    <div className={isInterrogated ? "suspect-card interrogated" : "suspect-card"}>
      <div className="suspect-icon">👤</div>

      <div className="suspect-content">
        <span className="suspect-label">SUSPECT</span>

        <h3>{suspect.name}</h3>

        <p>{suspect.description}</p>

        <div className="suspect-alibi">
          <strong>Alibi:</strong>
          <p>{suspect.alibi}</p>
        </div>

        {isInterrogated ? (
          <div className="suspect-statement">
            <strong>Declarația la interogare:</strong>
            <p>{suspect.statement || "Suspectul a refuzat să declare ceva."}</p>
          </div>
        ) : (
          <button className="interrogate-btn" onClick={onInterrogate}>
            Interoghează suspectul
          </button>
        )}
      </div>
    </div>
  );
}

export default SuspectCard;
