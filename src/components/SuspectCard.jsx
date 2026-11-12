
function SuspectCard({ suspect }) {
  return (
    <div className="suspect-card">
      <div className="suspect-icon">👤</div>

      <div className="suspect-content">
        <span className="suspect-label">SUSPECT</span>

        <h3>{suspect.name}</h3>

        <p>{suspect.description}</p>

        <div className="suspect-alibi">
          <strong>Alibi:</strong>
          <p>{suspect.alibi}</p>
        </div>
      </div>
    </div>
  );
}

export default SuspectCard;
