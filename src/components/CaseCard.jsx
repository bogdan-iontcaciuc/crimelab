
import { Link } from "react-router-dom";
import {
    ArrowRight,
    MapPin,
    UserRound,
    FolderOpen
} from "lucide-react";

function CaseCard({ caz }) {
    const dificultate = caz.difficulty || "Necunoscută";

    const difficultyClass =
        dificultate.toLowerCase() === "ușor"
            ? "usor"
            : dificultate.toLowerCase() === "mediu"
                ? "mediu"
                : "dificil";

    return (
        <article className="case-card">
            <div className="case-card-top">
                <div className="case-card-icon">
                    <FolderOpen size={25} />
                </div>

                <span className={`case-difficulty ${difficultyClass}`}>
                    {dificultate}
                </span>
            </div>

            <div className="case-card-code">
                DOSAR #{String(caz.id).padStart(3, "0")}
            </div>

            <h3>{caz.title}</h3>
            <p className="case-description">{caz.description}</p>

            <div className="case-card-meta">
                <span>
                    <MapPin size={15} />
                    {caz.location || "Locație necunoscută"}
                </span>

                <span>
                    <UserRound size={15} />
                    {caz.victim || "Nespecificat"}
                </span>
            </div>

            <div className="case-card-bottom">
                <span className="case-status">
                    <span className="case-status-dot" />
                    {caz.status || "Disponibil"}
                </span>

                <Link
                    to={`/investigation/${caz.id}`}
                    className="case-open-btn"
                >
                    Investighează
                    <ArrowRight size={17} />
                </Link>
            </div>
        </article>
    );
}

export default CaseCard;
