import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    UserRound,
    ArrowLeft,
    Send,
    HeartPulse,
    Timer,
    Target,
    LoaderCircle
} from "lucide-react";
import "../styles/interrogation.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001";

const AI_URL =
    import.meta.env.VITE_AI_URL || "http://localhost:3002";

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

const INITIAL_REPLY = "De ce m-ați adus aici?";

function readProgress(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || {};
    } catch {
        return {};
    }
}

function Interrogation() {
    const { caseId, suspectId } = useParams();
    return <InterrogationSession key={`${caseId}:${suspectId}`} caseId={caseId} suspectId={suspectId} />;
}

function InterrogationSession({ caseId, suspectId }) {
    const storageKey = `crimelab:interrogation:${caseId}:${suspectId}`;
    const handleRestart = () => {
        if (!window.confirm("Reîncepi interogatoriul? Progresul acestui suspect va fi șters.")) return;
        try {
            localStorage.removeItem(storageKey);
            requestRef.current?.abort();
            requestRef.current = null;
            setQuestion("");
            setPresentedEvidenceIds([]);
            setDisclosureIds([]);
            setSelectedEvidence("");
            setReply(INITIAL_REPLY);
            setMessages([]);
            setIsThinking(false);
            setChatError("");
            setCooperation(30);
            setStress(10);
            setHeartRate(78);
            setAttempts(10);
            setTimeLeft(600);
            setDeadline(Date.now() + 600000);
        } catch {
            setChatError("Progresul nu a putut fi resetat.");
        }
    };
    const [saved] = useState(() => readProgress(storageKey));
    const [presentedEvidenceIds, setPresentedEvidenceIds] = useState(() => Array.isArray(saved.presentedEvidenceIds) ? saved.presentedEvidenceIds.map(String) : []);
    const [disclosureIds, setDisclosureIds] = useState(() => Array.isArray(saved.disclosureIds) ? saved.disclosureIds.map(String) : []);
    const [evidenceItems, setEvidenceItems] = useState([]);
    const [evidenceError, setEvidenceError] = useState("");
    const [selectedEvidence, setSelectedEvidence] = useState("");
    const [showEvidence, setShowEvidence] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        const examined = readProgress(`crimelab:evidence:${caseId}`);
        fetch(`${API_URL}/evidence?caseId=${encodeURIComponent(caseId)}`, { signal: controller.signal })
            .then(res => { if (!res.ok) throw new Error("Probele nu au putut fi încărcate."); return res.json(); })
            .then(items => { if (!controller.signal.aborted) setEvidenceItems(items.filter(item => String(item.caseId) === String(caseId) && Array.isArray(examined) && examined.map(String).includes(String(item.id)))); })
            .catch(err => { if (!controller.signal.aborted) setEvidenceError(err.message); });
        return () => controller.abort();
    }, [caseId]);
    const [deadline, setDeadline] = useState(() => Number.isFinite(saved.deadline) ? saved.deadline : null);

    const [suspect, setSuspect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [question, setQuestion] = useState("");
    const [reply, setReply] = useState(saved.reply ?? INITIAL_REPLY);
    const [messages, setMessages] = useState(Array.isArray(saved.messages) ? saved.messages : []);
    const [isThinking, setIsThinking] = useState(false);
    const [chatError, setChatError] = useState("");

    const [cooperation, setCooperation] = useState(saved.cooperation ?? 30);
    const [stress, setStress] = useState(saved.stress ?? 10);
    const [heartRate, setHeartRate] = useState(saved.heartRate ?? 78);
    const [timeLeft, setTimeLeft] = useState(() => deadline === null ? 600 : Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    const [attempts, setAttempts] = useState(saved.attempts ?? 10);

    const requestRef = useRef(null);

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
                    throw new Error(
                        "Suspectul nu aparține acestui caz."
                    );
                }

                if (controller.signal.aborted) return;
                setDeadline((previous) => previous ?? Date.now() + 600000);
                setSuspect(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
            requestRef.current?.abort();
            requestRef.current = null;
        };
    }, [caseId, suspectId]);

    useEffect(() => {
        if (loading || error || !suspect || deadline === null) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                reply, messages, cooperation, stress, heartRate, attempts, deadline, presentedEvidenceIds, disclosureIds,
            }));
        } catch (err) {
            console.error("Progresul nu a putut fi salvat:", err);
        }
    }, [storageKey, loading, error, suspect, reply, messages, cooperation, stress, heartRate, attempts, deadline, presentedEvidenceIds, disclosureIds]);

    useEffect(() => {
        if (loading || error || !suspect || deadline === null) return;
        const updateTime = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setTimeLeft(remaining);
        };
        updateTime();
        if (attempts <= 0) return;
        const interval = setInterval(updateTime, 250);
        return () => clearInterval(interval);
    }, [loading, error, suspect, deadline, attempts]);

    const handleSendQuestion = async (e, evidence = null) => {
        e?.preventDefault();
        if (evidence && presentedEvidenceIds.includes(String(evidence.id))) return;
        const currentQuestion = evidence ? `Îți prezint proba: ${evidence.name}. Cum explici acest indiciu?` : question.trim();

        if (
            !currentQuestion ||
            !suspect ||
            isThinking ||
            requestRef.current ||
            attempts <= 0 ||
            timeLeft <= 0 ||
            (deadline !== null && Date.now() >= deadline)
        ) {
            return;
        }

        const controller = new AbortController();
        requestRef.current = controller;

        setIsThinking(true);
        setChatError("");
        if (!evidence) setQuestion("");

        try {
            const response = await fetch(
                `${AI_URL}/api/interrogate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        suspectName: suspect.name,
                        question: currentQuestion,
                        history: messages,
                        evidenceId: evidence ? String(evidence.id) : null,
                        presentedEvidenceIds,
                        disclosureIds,
                        stats: {
                            stress,
                            heartRate,
                            cooperation,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Suspectul nu poate răspunde momentan."
                );
            }

            if (
                typeof data.reply !== "string" ||
                !data.reply.trim()
            ) {
                throw new Error("Răspunsul suspectului este gol.");
            }

            if (controller.signal.aborted) return;

            console.log("Răspuns CrimeLab AI:", data);

            if (
                !Number.isFinite(data.stats?.stress) ||
                !Number.isFinite(data.stats?.heartRate) ||
                !Number.isFinite(data.stats?.cooperation)
            ) {
                throw new Error("Serverul AI nu a trimis indicatorii. Verifică versiunea backend-ului.");
            }

            if (!Array.isArray(data.disclosureIds) || !data.disclosureIds.every(id => typeof id === "string")) {
                throw new Error("Serverul AI nu a confirmat dezvăluirile. Verifică versiunea backend-ului.");
            }

            if (evidence && String(data.evidenceId) !== String(evidence.id)) {
                throw new Error("Serverul AI nu a confirmat proba. Verifică versiunea backend-ului.");
            }

            if (evidence) {
                setPresentedEvidenceIds(prev => [...prev, String(evidence.id)]);
                setSelectedEvidence("");
                setShowEvidence(false);
            }
            setDisclosureIds(data.disclosureIds);
            setReply(data.reply);
            setStress(data.stats.stress);
            setHeartRate(data.stats.heartRate);
            setCooperation(data.stats.cooperation);
            setAttempts((prev) => Math.max(0, prev - 1));

            setMessages((prev) => [
                ...prev,
                { role: "detective", content: currentQuestion, ...(evidence ? { evidenceId: String(evidence.id) } : {}) },
                {
                    role: "suspect",
                    content: data.reply,
                },
            ]);

        } catch (err) {
            if (controller.signal.aborted) return;

            console.error("Eroare interogatoriu:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Eroare necunoscută.";

            setChatError(
                `Nu s-a putut primi răspunsul. ${message}`
            );

            if (!evidence) setQuestion(currentQuestion);



        } finally {
            if (requestRef.current === controller) {
                requestRef.current = null;
                setIsThinking(false);
            }
        }
    };

    if (loading) {
        return (
            <p className="interrogation-message">
                Se pregătește camera de interogare...
            </p>
        );
    }

    if (error || !suspect) {
        return (
            <div className="interrogation-message">
                <p>{error || "Suspectul nu a fost găsit."}</p>

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
                        <span>COOPEREAZĂ</span>
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
                        {String(
                            Math.floor(timeLeft / 60)
                        ).padStart(2, "0")}
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

                    <div
                        className={`interrogation-bubble ${isThinking ? "bubble-thinking" : ""
                            }`}
                        aria-live="polite"
                    >
                        {isThinking
                            ? "Suspectul se gândește..."
                            : reply}
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

            {(timeLeft <= 0 || attempts <= 0) && (
                <div className="interrogation-chat-error" role="status">
                    {timeLeft <= 0
                        ? "Timpul a expirat. Interogatoriul s-a încheiat."
                        : "Ai utilizat toate cele 10 încercări."}
                    <div className="interrogation-restart-actions">
                        <button type="button" onClick={handleRestart}>↻ Reîncepe interogatoriul</button>
                        <Link to={`/investigation/${caseId}`}>Înapoi la investigație</Link>
                    </div>
                </div>
            )}

            {chatError && (
                <div
                    className="interrogation-chat-error"
                    role="alert"
                >
                    {chatError}
                </div>
            )}

            <form
                className="interrogation-controls"
                onSubmit={e => handleSendQuestion(e)}
            >
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={
                        timeLeft <= 0 || attempts <= 0
                            ? "Interogatoriu încheiat"
                            : isThinking
                                ? "Suspectul formulează răspunsul..."
                                : "Scrie întrebarea ta..."
                    }
                    autoComplete="off"
                    maxLength={1000}
                    disabled={
                        isThinking ||
                        attempts <= 0 ||
                        timeLeft <= 0
                    }
                    aria-label="Întrebarea pentru suspect"
                />

                <button
                    type="submit"
                    disabled={
                        !question.trim() ||
                        isThinking ||
                        attempts <= 0 ||
                        timeLeft <= 0
                    }
                >
                    {isThinking ? (
                        <LoaderCircle
                            size={18}
                            className="ai-spinner"
                        />
                    ) : (
                        <Send size={18} />
                    )}

                    {isThinking ? "Așteaptă..." : "Trimite"}
                </button>

            </form>
            <div className="evidence-inventory">
                <button type="button" className="evidence-toggle" onClick={() => setShowEvidence(prev => !prev)} aria-expanded={showEvidence}>
                    {showEvidence ? "Închide inventarul" : "Prezintă o probă"} ({evidenceItems.filter(item => !presentedEvidenceIds.includes(String(item.id))).length})
                </button>
                {showEvidence && <div className="evidence-panel">
                    <h3>Probe examinate</h3>
                    {evidenceError && <p role="alert">{evidenceError}</p>}
                    {!evidenceError && evidenceItems.length === 0 && <p>Examinează mai întâi probele din investigație.</p>}
                    {evidenceItems.map(item => {
                        const used = presentedEvidenceIds.includes(String(item.id));
                        return <button type="button" key={item.id} className={`evidence-option ${selectedEvidence === String(item.id) ? "selected" : ""}`} disabled={used || isThinking || attempts <= 0 || timeLeft <= 0} onClick={() => setSelectedEvidence(String(item.id))}>
                            <strong>{item.name}{used ? " — prezentată" : ""}</strong><span>{item.clue}</span>
                        </button>;
                    })}
                    <button type="button" className="evidence-toggle" disabled={!selectedEvidence || isThinking || attempts <= 0 || timeLeft <= 0} onClick={() => { const item = evidenceItems.find(item => String(item.id) === selectedEvidence); if (item) handleSendQuestion(null, item); }}>Prezintă suspectului (1 încercare)</button>
                </div>}
            </div>

        </section>
    );
}

export default Interrogation;