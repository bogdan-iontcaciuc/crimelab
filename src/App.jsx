
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Investigation from "./pages/Investigation";
import AdminCases from "./pages/AdminCases";
import Cases from "./pages/Cases";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Interrogation from "./pages/Interrogation";

function Pagina({ titlu }) {
    return (
        <section className="pagina">
            <h1>{titlu}</h1>
            <p>Această secțiune este în curs de dezvoltare.</p>
        </section>
    );
}

function App() {
    const location = useLocation();

    const isInterrogation =
        location.pathname.startsWith("/interrogation/");

    return (
        <>
            {!isInterrogation && <Navbar />}

            <main
                className={
                    isInterrogation ? "interrogation-main" : undefined
                }
            >
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/cazuri" element={<Cases />} />

                    <Route
                        path="/investigation/:id"
                        element={<Investigation />}
                    />

                    <Route
                        path="/interrogation/:caseId/:suspectId"
                        element={<Interrogation />}
                    />

                    <Route path="/admin" element={<AdminCases />} />

                    <Route path="/clasament" element={<Leaderboard />} />

                    <Route path="/despre" element={<About />} />

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
