
import {
    Shield,
    Search,
    Fingerprint,
    Users,
    Trophy,
    FolderOpen,
    Target,
    Code2,
    Database,
    ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";
import "../styles/about.css";

const pasi = [
    {
        icon: FolderOpen,
        titlu: "Alege un caz",
        descriere: "Explorează dosarele disponibile și selectează misterul pe care dorești să îl rezolvi."
    },
    {
        icon: Fingerprint,
        titlu: "Analizează indiciile",
        descriere: "Examinează probele, studiază suspecții și reconstruiește cronologia evenimentelor."
    },
    {
        icon: Target,
        titlu: "Descoperă adevărul",
        descriere: "Conectează informațiile și formulează propria concluzie despre caz."
    }
];

const functionalitati = [
    {
        icon: FolderOpen,
        titlu: "Dosare de investigație",
        descriere: "Cazuri misterioase cu diferite niveluri de dificultate."
    },
    {
        icon: Search,
        titlu: "Investigații interactive",
        descriere: "Analizează dovezile și descoperă informații relevante."
    },
    {
        icon: Users,
        titlu: "Analiza suspecților",
        descriere: "Explorează profilurile și declarațiile suspecților."
    },
    {
        icon: Trophy,
        titlu: "Clasamentul detectivilor",
        descriere: "Descoperă clasamentul și punctajele investigatorilor."
    }
];

function About() {
    return (
        <div className="about-page">
            <div className="about-container">

                <section className="about-hero">
                    <div className="about-badge">
                        <Shield size={17} />
                        DESPRE PROIECT
                    </div>

                    <h1>
                        Descoperă lumea <span>CrimeLab</span>
                    </h1>

                    <p>
                        CrimeLab este o platformă interactivă de investigații
                        criminalistice, creată pentru cei pasionați de mistere,
                        logică și descoperirea adevărului.
                    </p>

                    <Link to="/cazuri" className="about-button">
                        Explorează cazurile
                        <ArrowRight size={19} />
                    </Link>
                </section>

                <section className="about-mission">
                    <div className="about-mission-icon">
                        <Target size={38} />
                    </div>

                    <div>
                        <h2>Misiunea noastră</h2>

                        <p>
                            Ne propunem să dezvoltăm gândirea logică,
                            atenția la detalii și capacitatea de analiză
                            printr-o experiență digitală interactivă.
                            Fiecare caz reprezintă o nouă provocare
                            pentru viitorii detectivi.
                        </p>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Cum funcționează?</h2>

                    <p className="about-subtitle">
                        Trei pași pentru a deveni un detectiv CrimeLab.
                    </p>

                    <div className="about-steps">
                        {pasi.map((pas, index) => {
                            const Icon = pas.icon;

                            return (
                                <article className="about-card" key={pas.titlu}>
                                    <span className="about-step-number">
                                        0{index + 1}
                                    </span>

                                    <div className="about-card-icon">
                                        <Icon size={27} />
                                    </div>

                                    <h3>{pas.titlu}</h3>
                                    <p>{pas.descriere}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="about-section">
                    <h2>Ce oferă CrimeLab?</h2>

                    <p className="about-subtitle">
                        Instrumentele necesare unei experiențe de investigație.
                    </p>

                    <div className="about-features">
                        {functionalitati.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article className="about-card" key={item.titlu}>
                                    <div className="about-card-icon">
                                        <Icon size={27} />
                                    </div>

                                    <h3>{item.titlu}</h3>
                                    <p>{item.descriere}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="about-section">
                    <h2>Echipa de dezvoltare</h2>

                    <p className="about-subtitle">
                        Un proiect educațional realizat prin colaborare.
                    </p>

                    <div className="about-team">
                        <article className="about-card">
                            <div className="about-card-icon">
                                <Code2 size={30} />
                            </div>

                            <h3>Dezvoltare Frontend</h3>

                            <p>
                                Interfața utilizatorului, designul paginilor,
                                navigarea și experiența interactivă.
                            </p>

                            <div className="about-tags">
                                <span>React</span>
                                <span>CSS</span>
                                <span>Vite</span>
                            </div>
                        </article>

                        <article className="about-card">
                            <div className="about-card-icon">
                                <Database size={30} />
                            </div>

                            <h3>Dezvoltare Backend</h3>

                            <p>
                                Gestionarea datelor, logica investigațiilor
                                și administrarea dosarelor.
                            </p>

                            <div className="about-tags">
                                <span>JSON Server</span>
                                <span>REST API</span>
                                <span>JSON</span>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="about-cta">
                    <Shield size={42} />

                    <h2>Ești pregătit să descoperi adevărul?</h2>

                    <p>
                        Următorul mister așteaptă să fie rezolvat.
                    </p>

                    <Link to="/cazuri" className="about-button">
                        Începe investigația
                        <ArrowRight size={19} />
                    </Link>
                </section>

                <footer className="about-footer">
                    CrimeLab — Proiect educațional.
                    Cazurile sunt fictive.
                </footer>

            </div>
        </div>
    );
}

export default About;
