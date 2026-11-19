import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Investigation from "./pages/Investigation";
import AdminCases from "./pages/AdminCases";
import Cases from "./pages/Cases";
import Leaderboard from "./pages/Leaderboard";

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

                    <Route path="/cazuri" element={<Cases />} />

                    <Route path="/investigation/:id" element={<Investigation />} />

                    <Route path="/admin" element={<AdminCases />} />

                    <Route path="/clasament" element={<Leaderboard />} />

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
