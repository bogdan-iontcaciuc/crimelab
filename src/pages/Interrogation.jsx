
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    UserRound,
    ArrowLeft,
    Send,
    HeartPulse,
    Timer,
    Target
} from "lucide-react";
import "../styles/interrogation.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const SUSPECT_IMAGES = {
    "Edward Blackwood": "/images/interrogation/suspects/edward-blackwood.png",
    "Sarah Collins": "/images/interrogation/suspects/sarah-collins.png",
    "James Wilson": "/images/interrogation/suspects/james-wilson.png",

    "Elena Vance": "/images/interrogation/suspects/elena-vance.png",
    "Victor Marin": "/images/interrogation/suspects/victor-marin.png",
    "Arthur Doyle": "/images/interrogation/suspects/arthur-doyle.png",

    "Arthur Pendelton": "/images/interrogation/suspects/arthur-pendelton.png",
    "Luca Moretti": "/images/interrogation/suspects/luca-moretti.png",
    "George Vasile": "/images/interrogation/suspects/george-vasile.png",
};

function Interrogation() {
    const { caseId, suspectId } = useParams();

    const [suspect, setSuspect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState("");
    const [cooperation, setCooperation] = useState(30);
    const [stress, setStress] = useState(10);
    const [heartRate, setHeartRate] = useState(78);
    const [timeLeft, setTimeLeft] = useState(600);
    const [attempts, setAttempts] = useState(10);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError(null);
        setSuspect(null);
        setCooperation(30);
        setStress(10);
        setHeartRate(78);
        setTimeLeft(600);
        setAttempts(10);

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

                <div className="interrogation-cooperation">

                    <div className="cooperation-title">
                        NIVEL DE COOPERARE
                    </div>

                    <div className="cooperation-labels">
                        <span>REZISTĂ</span>
                        <span>NEUTRU</span>
                        <span>MĂRTURISEȘTE</span>
                    </div>

                    <div
                        className="cooperation-track"
                        role="meter"
                        aria-label="Nivel de cooperare"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={cooperation}
                    >
                        <div
                            className="cooperation-indicator"
                            style={{ left: `${cooperation}%` }}
                        />
                    </div>

                </div>

                <aside className="interrogation-hud hud-left">

                    <div className="hud-title">
                        <HeartPulse size={20} />
                        MONITOR CARDIAC
                    </div>

                    <div className="heart-rate">
                        {heartRate} <span>BPM</span>
                    </div>

                    <div className="heartbeat-monitor">
                        <svg viewBox="0 0 240 60">
                            <path
                                className="heartbeat-line"
                                d="M0 30 H30 L38 23 L46 30 H55
                   L62 42 L70 5 L78 55 L86 30
                   H110 L118 22 L126 30 H150
                   L158 23 L166 30 H175
                   L182 42 L190 5 L198 55
                   L206 30 H240"
                            />
                        </svg>
                    </div>

                    <div className="hud-divider"></div>

                    <div className="stress-info">
                        <span>NIVEL DE STRES</span>
                        <strong>{stress}%</strong>
                    </div>

                    <div className="stress-track">
                        <div
                            className="stress-fill"
                            style={{ width: `${stress}%` }}
                        />
                    </div>

                </aside>

                <aside className="interrogation-hud hud-right">

                    <div className="hud-title">
                        <Timer size={20} />
                        TIMP RĂMAS
                    </div>

                    <div className="interrogation-timer">
                        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}
                        :
                        {String(timeLeft % 60).padStart(2, "0")}
                    </div>

                    <div className="hud-divider"></div>

                    <div className="hud-title">
                        <Target size={20} />
                        ÎNCERCĂRI RĂMASE
                    </div>

                    <div className="attempts-value">
                        {attempts} <span>/ 10</span>
                    </div>

                </aside>

                <div className="interrogation-suspect">

                    <div className="interrogation-bubble">
                        De ce m-ați adus aici?
                    </div>

                    {SUSPECT_IMAGES[suspect.name] ? (
                        <img
                            className="interrogation-character"
                            src={SUSPECT_IMAGES[suspect.name]}
                            alt={suspect.name}
                            draggable={false}
                        />
                    ) : (
                        <div className="interrogation-avatar">
                            <UserRound size={120} strokeWidth={1} />
                        </div>
                    )}

                    <h2>{suspect.name}</h2>
                    <span className="interrogation-suspect-label">
                        SUSPECT
                    </span>

                </div>

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
