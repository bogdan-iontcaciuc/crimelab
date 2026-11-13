
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Fingerprint,
    Search,
    ShieldCheck,
    FolderOpen,
    Microscope,
    Users,
    LockKeyhole,
    FileSearch,
    ScanSearch,
    CheckCircle2,
    Clock3
} from "lucide-react";

import "../styles/home.css";

const statistici = [
    {
        numar: "06",
        titlu: "Cazuri disponibile",
        icon: FolderOpen
    },
    {
        numar: "24",
        titlu: "Probe de analizat",
        icon: Microscope
    },
    {
        numar: "12",
        titlu: "Suspecți",
        icon: Users
    }
];

const pasi = [
    {
        numar: "01",
        titlu: "Alege un caz",
        descriere:
            "Explorează dosarele disponibile și descoperă detaliile fiecărei investigații.",
        icon: FolderOpen
    },
    {
        numar: "02",
        titlu: "Analizează probele",
        descriere:
            "Studiază indiciile, verifică declarațiile și identifică legăturile dintre suspecți.",
        icon: ScanSearch
    },
    {
        numar: "03",
        titlu: "Rezolvă misterul",
        descriere:
            "Formulează o concluzie și descoperă dacă ai identificat persoana responsabilă.",
        icon: CheckCircle2
    }
];

function Home() {
    return (
        <div className="home">

            <section className="home-hero">
                <div className="home-hero-glow" />

                <div className="home-container home-hero-content">
                    <div className="home-hero-text">
                        <div className="home-eyebrow">
                            <span className="home-status-dot" />
                            SISTEM DE INVESTIGAȚII ACTIV
                        </div>

                        <h1>
                            FIECARE INDICIU
                            <br />
                            <span>CONTEAZĂ.</span>
                        </h1>

                        <p className="home-hero-description">
                            Intră în rolul unui detectiv. Analizează probe,
                            investighează suspecți și rezolvă cazuri
                            criminalistice fictive într-o experiență
                            interactivă.
                        </p>

                        <div className="home-hero-actions">
                            <Link to="/cazuri" className="home-btn-primary">
                                <Search size={18} />
                                Începe investigația
                                <ArrowRight size={18} />
                            </Link>

                            <a href="#cum-functioneaza" className="home-btn-secondary">
                                Cum funcționează
                            </a>
                        </div>

                        <div className="home-hero-note">
                            <ShieldCheck size={16} />
                            Toate cazurile sunt fictive și create
                            în scop educațional.
                        </div>
                    </div>

                    <div className="home-hero-visual" aria-hidden="true">
                        <div className="home-radar">
                            <div className="home-radar-ring ring-one" />
                            <div className="home-radar-ring ring-two" />
                            <div className="home-radar-ring ring-three" />

                            <div className="home-radar-center">
                                <Fingerprint size={110} strokeWidth={1} />
                            </div>

                            <div className="home-radar-label label-top">
                                <span>IDENTIFICARE</span>
                                <strong>ÎN CURS</strong>
                            </div>

                            <div className="home-radar-label label-bottom">
                                <span>PROTOCOL</span>
                                <strong>CRIMELAB / 01</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-stats">
                <div className="home-container home-stats-grid">
                    {statistici.map(({ numar, titlu, icon: Icon }) => (
                        <div className="home-stat" key={titlu}>
                            <div className="home-stat-icon">
                                <Icon size={23} />
                            </div>

                            <div>
                                <strong>{numar}</strong>
                                <p>{titlu}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section
                className="home-section home-process"
                id="cum-functioneaza"
            >
                <div className="home-container">
                    <div className="home-section-heading">
                        <span className="home-section-label">
                            PROTOCOL DE INVESTIGAȚIE
                        </span>

                        <h2>
                            Cum funcționează <span>CrimeLab?</span>
                        </h2>

                        <p>
                            Trei pași te despart de rezolvarea
                            următorului mister.
                        </p>
                    </div>

                    <div className="home-steps-grid">
                        {pasi.map(({ numar, titlu, descriere, icon: Icon }) => (
                            <article className="home-step-card" key={numar}>
                                <div className="home-step-top">
                                    <div className="home-step-icon">
                                        <Icon size={27} />
                                    </div>
                                    <span>{numar}</span>
                                </div>

                                <h3>{titlu}</h3>
                                <p>{descriere}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-section home-featured">
                <div className="home-container">
                    <div className="home-section-heading">
                        <span className="home-section-label">
                            DOSAR RECOMANDAT
                        </span>

                        <h2>
                            Prima ta <span>investigație</span>
                        </h2>

                        <p>
                            Ești pregătit să descoperi adevărul?
                        </p>
                    </div>

                    <div className="home-case-card">
                        <div className="home-case-visual">
                            <div className="home-case-stamp">
                                <LockKeyhole size={15} />
                                DOSAR CONFIDENȚIAL
                            </div>

                            <FileSearch size={105} strokeWidth={1} />

                            <span className="home-case-code">
                                CRL-001 / ARHIVĂ
                            </span>
                        </div>

                        <div className="home-case-info">
                            <div className="home-case-tags">
                                <span className="home-tag-red">
                                    CAZ FICTIV
                                </span>

                                <span className="home-tag-neutral">
                                    DIFICULTATE: UȘOARĂ
                                </span>
                            </div>

                            <h3>Misterul din laborator</h3>

                            <p>
                                Un document important dispare dintr-un
                                laborator de cercetare. Trei persoane
                                aveau acces în încăpere, dar declarațiile
                                lor nu coincid. Poți descoperi ce s-a
                                întâmplat?
                            </p>

                            <div className="home-case-details">
                                <span>
                                    <Users size={16} />
                                    3 suspecți
                                </span>

                                <span>
                                    <Clock3 size={16} />
                                    15–20 minute
                                </span>
                            </div>

                            <Link to="/cazuri" className="home-case-link">
                                Explorează cazurile
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="home-container home-footer-content">
                    <div className="home-footer-brand">
                        <Fingerprint size={23} />
                        <strong>CRIME<span>LAB</span></strong>
                    </div>

                    <p>
                        Simulator educațional de investigații fictive.
                    </p>

                    <span>© {new Date().getFullYear()} CrimeLab</span>
                </div>
            </footer>

        </div>
    );
}

export default Home;
