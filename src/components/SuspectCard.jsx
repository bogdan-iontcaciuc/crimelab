function SuspectCard({ suspect, isInterrogated = false, onInterrogate }) {
    return (
        <div className={isInterrogated ? "suspect-card interrogated" : "suspect-card"}>
            <div className="suspect-icon">👤</div>

            <div className="suspect-content">
                <span className="suspect-label">
                    {isInterrogated ? "SUSPECT INTEROGAT" : "SUSPECT"}
                </span>

                <h3>{suspect.name}</h3>

                <p>{suspect.description}</p>

                <div className="suspect-alibi">
                    <strong>Alibi:</strong>
                    <p>{suspect.alibi}</p>
                </div>

                {isInterrogated && (
                    <div className="suspect-statement">
                        <strong>Declarația inițială:</strong>
                        <p>
                            {suspect.statement ||
                                "Suspectul a refuzat să declare ceva."}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    className="interrogate-btn"
                    onClick={onInterrogate}
                >
                    {isInterrogated
                        ? "Continuă interogatoriul"
                        : "Interoghează suspectul"}
                </button>
            </div>
        </div>
    );
}

export default SuspectCard;