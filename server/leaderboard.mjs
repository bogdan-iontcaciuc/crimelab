import { readFileSync, writeFileSync, renameSync } from "node:fs";

const file = new URL("./leaderboard-data.json", import.meta.url);
const temporary = new URL("./leaderboard-data.tmp", import.meta.url);

function readScores() {
    try {
        const data = JSON.parse(readFileSync(file, "utf8"));
        if (!Array.isArray(data)) throw new Error("Date invalide.");
        return data;
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") return Array();
        throw error;
    }
}

export function saveBestScore(detective, caseId, score) {
    const scores = readScores();
    const existing = scores.find(item => item.detectiveId === detective.id && item.caseId === caseId);
    if (existing) {
        existing.score = Math.max(existing.score, score);
    } else {
        scores.push({ detectiveId: detective.id, caseId, score, name: detective.name.trim() });
    }
    for (const item of scores) {
        if (item.detectiveId === detective.id) item.name = detective.name.trim();
    }
    writeFileSync(temporary, JSON.stringify(scores, null, 2), "utf8");
    renameSync(temporary, file);
}

export function getLeaderboard() {
    const detectives = new Map();
    for (const item of readScores()) {
        const entry = detectives.get(item.detectiveId) || { id: item.detectiveId, nume: item.name, cazuri: 0, puncte: 0 };
        entry.cazuri++;
        entry.puncte += item.score;
        detectives.set(item.detectiveId, entry);
    }
    return [...detectives.values()].sort((a, b) => b.puncte - a.puncte || b.cazuri - a.cazuri || a.nume.localeCompare(b.nume, "ro") || a.id.localeCompare(b.id));
}

/** @param {string} id @param {string} name */
export function updateDetectiveName(id, name) {
    const scores = readScores();
    let changed = false;
    for (const item of scores) {
        if (item.detectiveId === id && item.name !== name) {
            item.name = name;
            changed = true;
        }
    }
    if (changed) {
        writeFileSync(temporary, JSON.stringify(scores, null, 2), "utf8");
        renameSync(temporary, file);
    }
}