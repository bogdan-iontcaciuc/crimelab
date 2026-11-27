import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, UserRound } from "lucide-react";
import "../styles/detectiveProfile.css";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3002";
const KEY = "crimelab:detective";
const EVENT = "crimelab:detective-changed";

export function readDetective() {
    try {
        const value = JSON.parse(localStorage.getItem(KEY));
        return typeof value?.id === "string" && value.id && typeof value.name === "string" && value.name.trim() ? value : null;
    } catch { return null; }
}

export function useDetective() {
    const [profile, setProfile] = useState(readDetective);
    useEffect(() => {
        const update = () => setProfile(readDetective());
        window.addEventListener(EVENT, update);
        window.addEventListener("storage", update);
        update();
        return () => {
            window.removeEventListener(EVENT, update);
            window.removeEventListener("storage", update);
        };
    }, []);
    return profile;
}

export function DetectiveModal({ profile, onClose }) {
    const [name, setName] = useState(profile?.name || "");
    const [error, setError] = useState("");
    const dialog = useRef(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        const element = dialog.current;
        element.showModal();
        return () => { if (element.open) element.close(); };
    }, []);
    const save = async (event) => {
        event.preventDefault();
        if (saving) return;
        const clean = name.trim().replace(/\s+/g, " ");
        if (clean.length < 2 || clean.length > 40) {
            setError("Introdu un nume între 2 și 40 de caractere.");
            return;
        }
        setSaving(true);
        try {
            const current = readDetective();
            const id = current?.id || crypto.randomUUID();
            if (current && current.name !== clean) {
                const response = await fetch(`${AI_URL}/api/leaderboard/profile`, {
                    method: "PATCH", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, name: clean })
                });
                if (!response.ok) throw new Error("Numele nu a putut fi sincronizat cu clasamentul.");
            }
            localStorage.setItem(KEY, JSON.stringify({ id, name: clean }));
            window.dispatchEvent(new Event(EVENT));
            onClose?.();
        } catch { setError("Profilul nu a putut fi actualizat. Verifică serverul AI și încearcă din nou."); }
        finally { setSaving(false); }
    };
    return (
        <dialog ref={dialog} className="detective-modal" aria-labelledby="detective-title" onCancel={event => { event.preventDefault(); onClose?.(); }}>
            <form onSubmit={save}>
                <div className="detective-emblem"><ShieldCheck size={36} /></div>
                <span className="detective-eyebrow">CRIMELAB / IDENTITATE</span>
                <h2 id="detective-title">{profile ? "Editează profilul" : "Bun venit, detectiv!"}</h2>
                <p>Alege numele cu care vei apărea în clasamentul CrimeLab.</p>
                <label htmlFor="detective-name">Numele detectivului</label>
                <input id="detective-name" autoFocus value={name} onChange={event => { setName(event.target.value); setError(""); }} maxLength={40} placeholder="Introdu numele tău" required />
                {error && <p className="detective-error" role="alert">{error}</p>}
                <button className="detective-save" type="submit" disabled={saving}>{profile ? "Salvează modificările" : "Salvează profilul"}</button>
                {onClose ? <button className="detective-cancel" type="button" onClick={onClose}>Anulează</button> : <Link className="detective-cancel" to="/cazuri">Înapoi la cazuri</Link>}
            </form>
        </dialog>
    );
}

export function DetectiveGate({ children }) {
    const profile = useDetective();
    return profile ? children : <DetectiveModal profile={null} />;
}

export function DetectiveProfileButton() {
    const profile = useDetective();
    const [open, setOpen] = useState(false);
    return <>
        <button type="button" className="navbar-detective" onClick={() => setOpen(true)} title={profile?.name || "Creează profilul"}><UserRound size={18} /><span>{profile?.name || "Profil detectiv"}</span></button>
        {open && <DetectiveModal profile={profile} onClose={() => setOpen(false)} />}
    </>;
}