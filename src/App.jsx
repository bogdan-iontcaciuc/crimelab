import { Routes, Route, Link } from "react-router-dom";

function Pagina({ titlu }) {
    return (
        <section className="pagina">
            <h1>{titlu}</h1>
            <p>Această pagină este în curs de dezvoltare.</p>
        </section>
    );
}

function App() {
    return (
        <>
            <header className="header">
                <Link to="/" className="logo">
                    CRIME<span>LAB</span>
                </Link>

                <nav>
                    <Link to="/">Acasă</Link>
                    <Link to="/cazuri">Cazuri</Link>
                    <Link to="/clasament">Clasament</Link>
                    <Link to="/despre">Despre noi</Link>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Pagina titlu="Bine ai venit la CrimeLab" />} />
                    <Route path="/cazuri" element={<Pagina titlu="Cazuri disponibile" />} />
                    <Route path="/clasament" element={<Pagina titlu="Clasamentul detectivilor" />} />
                    <Route path="/despre" element={<Pagina titlu="Despre CrimeLab" />} />
                    <Route path="*" element={<Pagina titlu="Pagina nu a fost găsită" />} />
                </Routes>
            </main>
        </>
    );
}

export default App;