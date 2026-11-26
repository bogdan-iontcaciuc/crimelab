
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserRound, ArrowLeft, Send } from "lucide-react";
import "../styles/interrogation.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Interrogation() {
    const { caseId, suspectId } = useParams();

    const [suspect, setSuspect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError(null);
        setSuspect(null);

        fetch(`${API_URL}/suspects/${suspectId}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Suspectul nu a fost găsit.");
                }

                return res.json();
            })
            .then((data) => {
                if (String(data.caseId) !== String(caseId)) {
                    throw new Error("Suspectul nu aparține acestui caz.");
                }

                setSuspect(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [caseId, suspectId]);

    if (loading) {
        return (
            <p className="interrogation-message">
                Se pregătește camera de interogare...
            </p>
        );
    }

    if (error) {
        return (
            <div className="interrogation-message">
                <p>{error}</p>
                <Link to={`/investigation/${caseId}`}>
                    Înapoi la investigație
                </Link>
            </div>
        );
    }

    return (
        <section className="interrogation-page">

            <header className="interrogation-header">
                <Link
                    to={`/investigation/${caseId}`}
                    className="interrogation-back"
                >
                    <ArrowLeft size={18} />
                    Înapoi la investigație
                </Link>

                <div className="interrogation-recording">
                    <span className="recording-dot"></span>
                    REC
                </div>
            </header>

            <div className="interrogation-room">

                <div className="interrogation-lamp"></div>

                <div className="interrogation-suspect">

                    <div className="interrogation-bubble">
                        De ce m-ați adus aici?
                    </div>

                    <div className="interrogation-avatar">
                        <UserRound size={120} strokeWidth={1} />
                    </div>

                    <h2>{suspect.name}</h2>
                    <span className="interrogation-suspect-label">
                        SUSPECT
                    </span>

                </div>

                <div className="interrogation-table"></div>

            </div>

            <div className="interrogation-controls">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Scrie întrebarea ta..."
                    autoComplete="off"
                    aria-label="Întrebarea pentru suspect"
                />

                <button
                    type="button"
                    disabled
                    title="Conversația va fi implementată în etapa următoare"
                >
                    <Send size={18} />
                    Trimite
                </button>
            </div>

        </section>
    );
}

export default Interrogation;
