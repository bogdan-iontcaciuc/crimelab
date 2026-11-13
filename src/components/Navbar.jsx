
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    Shield,
    House,
    FolderOpen,
    Trophy,
    Info,
    Menu,
    X,
    Search
} from "lucide-react";

import "../styles/navbar.css";

function Navbar() {
    const [meniuDeschis, setMeniuDeschis] = useState(false);

    const inchideMeniu = () => setMeniuDeschis(false);

    const linkuri = [
        { cale: "/", nume: "Acasă", icon: House },
        { cale: "/cazuri", nume: "Cazuri", icon: FolderOpen },
        { cale: "/clasament", nume: "Clasament", icon: Trophy },
        { cale: "/despre", nume: "Despre noi", icon: Info }
    ];

    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={inchideMeniu}
                >
                    <Shield size={28} />
                    <span>
                        CRIME<strong>LAB</strong>
                    </span>
                </Link>

                <nav
                    id="navigare-principala"
                    className={`navbar-links ${meniuDeschis ? "deschis" : ""}`}
                    aria-label="Navigare principală"
                >
                    {linkuri.map(({ cale, nume, icon: Icon }) => (
                        <NavLink
                            key={cale}
                            to={cale}
                            end={cale === "/"}
                            onClick={inchideMeniu}
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? "activ" : ""}`
                            }
                        >
                            <Icon size={17} />
                            {nume}
                        </NavLink>
                    ))}
                </nav>

                <Link
                    to="/cazuri"
                    className="navbar-action"
                    onClick={inchideMeniu}
                >
                    <Search size={17} />
                    Începe investigația
                </Link>

                <button
                    className="navbar-toggle"
                    type="button"
                    aria-label={meniuDeschis ? "Închide meniul" : "Deschide meniul"}
                    aria-expanded={meniuDeschis}
                    aria-controls="navigare-principala"
                    onClick={() => setMeniuDeschis(!meniuDeschis)}
                >
                    {meniuDeschis ? <X size={26} /> : <Menu size={26} />}
                </button>

            </div>
        </header>
    );
}

export default Navbar;
