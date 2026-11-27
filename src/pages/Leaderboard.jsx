import { useEffect, useMemo, useState } from "react";
import {
    Trophy,
    Medal,
    Search,
    ShieldCheck,
    Target,
    Crown,
    UserRound,
} from "lucide-react";
import "../styles/leaderboard.css";
import { useDetective } from "../components/DetectiveProfile";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3002";

const formatPuncte = (valoare) =>
    new Intl.NumberFormat("ro-RO").format(valoare);

function Leaderboard() {
    const profile = useDetective();
    const [cautare, setCautare] = useState("");
    const [detectivi, setDetectivi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        setError("");
        fetch(`${AI_URL}/api/leaderboard`, { signal: controller.signal })
            .then(async response => {
                if (!response.ok) throw new Error("Clasamentul nu a putut fi încărcat.");
                const data = await response.json();
                if (!Array.isArray(data)) throw new Error("Date invalide.");
                if (!controller.signal.aborted) setDetectivi(data);
            })
            .catch(() => { if (!controller.signal.aborted) setError("Clasamentul nu este disponibil. Verifică serverul AI."); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [profile?.id, profile?.name]);

    const clasament = useMemo(
        () => [...detectivi].sort((a, b) => b.puncte - a.puncte),
        [detectivi]
    );

    const rezultate = clasament.filter((detectiv) =>
        detectiv.nume.toLocaleLowerCase("ro").includes(
            cautare.trim().toLocaleLowerCase("ro")
        )
    );

    const podium = [clasament[1], clasament[0], clasament[2]].filter(Boolean);

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-container">
                <header className="leaderboard-header">
                    <div className="leaderboard-eyebrow">
                        <Trophy size={17} />
                        CRIMELAB / CLASAMENT
                    </div>

                    <h1>
                        Clasamentul <span>detectivilor</span>
                    </h1>

                    <p>
                        Descoperă cei mai buni investigatori și urmărește
                        progresul comunității CrimeLab.
                    </p>
                </header>

                <div className="leaderboard-stats">
                    <div className="leaderboard-stat">
                        <UserRound size={22} />
                        <div>
                            <strong>{detectivi.length}</strong>
                            <span>Detectivi</span>
                        </div>
                    </div>

                    <div className="leaderboard-stat">
                        <Target size={22} />
                        <div>
                            <strong>
                                {detectivi.reduce((total, d) => total + d.cazuri, 0)}
                            </strong>
                            <span>Cazuri rezolvate</span>
                        </div>
                    </div>

                    <div className="leaderboard-stat">
                        <ShieldCheck size={22} />
                        <div>
                            <strong>{formatPuncte(clasament[0]?.puncte ?? 0)}</strong>
                            <span>Record de puncte</span>
                        </div>
                    </div>
                </div>

                <section className="leaderboard-section">
                    <h2>
                        <Crown size={22} />
                        Top 3 detectivi
                    </h2>

                    <div className="leaderboard-podium" style={podium.length < 3 ? { display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-end" } : undefined}>
                        {podium.map((detectiv) => {
                            const pozitie =
                                clasament.findIndex((d) => d.id === detectiv.id) + 1;

                            return (
                                <article
                                    key={detectiv.id}
                                    className={`podium-card podium-${pozitie}`}
                                    style={podium.length < 3 ? { flex: "0 1 calc((100% - 32px) / 3)", minWidth: "min(100%, 260px)", boxSizing: "border-box" } : undefined}
                                >
                                    <div className="podium-medal">
                                        {pozitie === 1 ? (
                                            <Crown size={28} />
                                        ) : (
                                            <Medal size={28} />
                                        )}
                                    </div>

                                    <span className="podium-rank">LOCUL {pozitie}</span>

                                    <div className="podium-avatar">
                                        <UserRound size={29} />
                                    </div>

                                    <h3>{detectiv.nume}</h3>

                                    <strong>{formatPuncte(detectiv.puncte)} puncte</strong>

                                    <p>{detectiv.cazuri} cazuri rezolvate</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="leaderboard-section">
                    <div className="leaderboard-table-header">
                        <h2>
                            <Trophy size={22} />
                            Clasament general
                        </h2>

                        <label className="leaderboard-search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Caută un detectiv..."
                                aria-label="Caută un detectiv"
                                value={cautare}
                                onChange={(e) => setCautare(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="leaderboard-table-wrapper">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Poziție</th>
                                    <th>Detectiv</th>
                                    <th>Cazuri rezolvate</th>
                                    <th>Punctaj</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rezultate.map((detectiv) => {
                                    const pozitie =
                                        clasament.findIndex((d) => d.id === detectiv.id) + 1;

                                    return (
                                        <tr key={detectiv.id}>
                                            <td>
                                                <span className="leaderboard-position">
                                                    #{pozitie}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="leaderboard-detective">
                                                    <span className="leaderboard-avatar">
                                                        <UserRound size={19} />
                                                    </span>
                                                    {detectiv.nume}
                                                </div>
                                            </td>

                                            <td>{detectiv.cazuri}</td>

                                            <td className="leaderboard-points">
                                                {formatPuncte(detectiv.puncte)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {rezultate.length === 0 && (
                            <p className="leaderboard-empty">
                                {loading ? "Se încarcă clasamentul..." : error || (detectivi.length ? "Nu am găsit niciun detectiv." : "Rezolvă primul caz pentru a intra în clasament.")}
                            </p>
                        )}
                    </div>
                </section>


            </div>
        </div>
    );
}

export default Leaderboard;