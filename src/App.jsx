
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function Pagina({ titlu }) {
    return (
        <section className="pagina">
            <h1>{titlu}</h1>
            <p>Această secțiune este în curs de dezvoltare.</p>
        </section>
    );
}

function App() {
    return (
        <>
            <Navbar />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/cazuri"
                        element={<Pagina titlu="Cazuri disponibile" />}
                    />

                    <Route
                        path="/clasament"
                        element={<Pagina titlu="Clasamentul detectivilor" />}
                    />

                    <Route
                        path="/despre"
                        element={<Pagina titlu="Despre CrimeLab" />}
                    />

                    <Route
                        path="*"
                        element={<Pagina titlu="Pagina nu a fost găsită" />}
                    />
                </Routes>
            </main>
        </>
    );
}

export default App;
