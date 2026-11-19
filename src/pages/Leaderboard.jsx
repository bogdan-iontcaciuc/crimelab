
import { useMemo, useState } from "react";
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

const detectivi = [
    { id: 1, nume: "Alexandru Popescu", cazuri: 18, puncte: 2450 },
    { id: 2, nume: "Maria Ionescu", cazuri: 15, puncte: 2180 },
    { id: 3, nume: "Andrei Dumitrescu", cazuri: 13, puncte: 1920 },
    { id: 4, nume: "Elena Marinescu", cazuri: 11, puncte: 1680 },
    { id: 5, nume: "Vlad Georgescu", cazuri: 9, puncte: 1450 },
    { id: 6, nume: "Ioana Stan", cazuri: 8, puncte: 1210 },
    { id: 7, nume: "Mihai Radu", cazuri: 6, puncte: 980 },
    { id: 8, nume: "Ana Pavel", cazuri: 5, puncte: 750 },
];

const formatPuncte = (valoare) =>
    new Intl.NumberFormat("ro-RO").format(valoare);

function Leaderboard() {
    const [cautare, setCautare] = useState("");

    const clasament = useMemo(
        () => [...detectivi].sort((a, b) => b.puncte - a.puncte),
        []
    );

    const rezultate = clasament.filter((detectiv) =>
        detectiv.nume.toLocaleLowerCase("ro").includes(
            cautare.trim().toLocaleLowerCase("ro")
        )
    );

    const podium = [clasament[1], clasament[0], clasament[2]];

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
                            <strong>{formatPuncte(clasament[0].puncte)}</strong>
                            <span>Record de puncte</span>
                        </div>
                    </div>
                </div>

                <section className="leaderboard-section">
                    <h2>
                        <Crown size={22} />
                        Top 3 detectivi
                    </h2>

                    <div className="leaderboard-podium">
                        {podium.map((detectiv) => {
                            const pozitie =
                                clasament.findIndex((d) => d.id === detectiv.id) + 1;

                            return (
                                <article
                                    key={detectiv.id}
                                    className={`podium-card podium-${pozitie}`}
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
                                Nu am găsit niciun detectiv.
                            </p>
                        )}
                    </div>
                </section>

                <p className="leaderboard-demo-note">
                    Date demonstrative — clasamentul va putea fi conectat
                    ulterior la backend.
                </p>
            </div>
        </div>
    );
}

export default Leaderboard;
