
import { useEffect, useMemo, useState } from "react";
import {
    Search,
    FolderOpen,
    SlidersHorizontal,
    RefreshCw
} from "lucide-react";

import CaseCard from "../components/CaseCard";
import "../styles/cases.css";

const API_URL = "http://localhost:3001";

function Cases() {
    const [cazuri, setCazuri] = useState([]);
    const [cautare, setCautare] = useState("");
    const [dificultate, setDificultate] = useState("Toate");
    const [sortare, setSortare] = useState("implicit");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function incarcaCazuri() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/cases`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Nu s-au putut încărca dosarele.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Formatul datelor este invalid.");
                }

                setCazuri(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        "Nu putem încărca dosarele. Verifică dacă serverul rulează."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        incarcaCazuri();

        return () => controller.abort();
    }, []);

    const cazuriFiltrate = useMemo(() => {
        const text = cautare.trim().toLocaleLowerCase("ro");

        const rezultat = cazuri.filter((caz) => {
            const campuri = [
                caz.title,
                caz.description,
                caz.location
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("ro");

            const corespundeCautarii = campuri.includes(text);

            const corespundeDificultatii =
                dificultate === "Toate" ||
                caz.difficulty === dificultate;

            return corespundeCautarii && corespundeDificultatii;
        });

        if (sortare === "titlu") {
            rezultat.sort((a, b) =>
                a.title.localeCompare(b.title, "ro")
            );
        }

        if (sortare === "dificultate") {
            const ordine = {
                "Ușor": 1,
                "Mediu": 2,
                "Dificil": 3
            };

            rezultat.sort(
                (a, b) =>
                    (ordine[a.difficulty] ?? 99) -
                    (ordine[b.difficulty] ?? 99)
            );
        }

        return rezultat;
    }, [cazuri, cautare, dificultate, sortare]);

    return (
        <div className="cases-page">
            <div className="cases-container">

                <div className="cases-header">
                    <div className="cases-eyebrow">
                        <FolderOpen size={16} />
                        ARHIVA CRIMELAB
                    </div>

                    <h1>
                        Dosare de <span>investigație</span>
                    </h1>

                    <p>
                        Explorează cazurile disponibile, analizează
                        indiciile și descoperă adevărul.
                    </p>
                </div>

                <div className="cases-toolbar">
                    <label className="cases-search">
                        <Search size={19} />
                        <input
                            type="search"
                            placeholder="Caută după titlu, descriere sau locație..."
                            value={cautare}
                            onChange={(e) => setCautare(e.target.value)}
                            aria-label="Caută dosare"
                        />
                    </label>

                    <div className="cases-select-wrapper">
                        <SlidersHorizontal size={17} />

                        <select
                            value={dificultate}
                            onChange={(e) => setDificultate(e.target.value)}
                            aria-label="Filtrează după dificultate"
                        >
                            <option value="Toate">Toate dificultățile</option>
                            <option value="Ușor">Ușor</option>
                            <option value="Mediu">Mediu</option>
                            <option value="Dificil">Dificil</option>
                        </select>
                    </div>

                    <select
                        className="cases-sort"
                        value={sortare}
                        onChange={(e) => setSortare(e.target.value)}
                        aria-label="Sortează dosarele"
                    >
                        <option value="implicit">Ordine implicită</option>
                        <option value="titlu">Titlu A–Z</option>
                        <option value="dificultate">Dificultate crescătoare</option>
                    </select>
                </div>

                <div className="cases-results">
                    <span>
                        {loading
                            ? "Se încarcă dosarele..."
                            : `${cazuriFiltrate.length} dosare găsite`}
                    </span>
                </div>

                {loading && (
                    <div className="cases-message">
                        <RefreshCw className="cases-spin" size={25} />
                        <p>Se încarcă dosarele...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="cases-message cases-error" role="alert">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Reîncearcă
                        </button>
                    </div>
                )}

                {!loading && !error && cazuriFiltrate.length === 0 && (
                    <div className="cases-message">
                        <Search size={30} />
                        <h3>Nu am găsit niciun dosar</h3>
                        <p>Încearcă alt termen sau schimbă filtrele.</p>
                    </div>
                )}

                {!loading && !error && cazuriFiltrate.length > 0 && (
                    <div className="cases-grid">
                        {cazuriFiltrate.map((caz) => (
                            <CaseCard key={caz.id} caz={caz} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Cases;
