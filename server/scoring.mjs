/**
 * @param {any} db
 * @param {string} caseId
 * @param {string} suspectId
 * @param {boolean} correct
 * @param {{
 *     examinedEvidence?: string[],
 *     sessions?: Record<string, {
 *         attempts?: number,
 *         disclosureIds?: string[],
 *         presentedEvidenceIds?: string[]
 *     }>
 * }} progress
 */
export function calculateScore(db, caseId, suspectId, correct, progress = {
    examinedEvidence: Array(),
    sessions: Object.create(null)
}) {
    const evidence = db.evidence.filter(
        item => String(item.caseId) === caseId
    );

    const suspects = db.suspects.filter(
        item => String(item.caseId) === caseId
    );

    const examined = new Set(
        Array.isArray(progress?.examinedEvidence)
            ? progress.examinedEvidence.map(String)
            : []
    );

    const examinedCount = evidence.filter(
        item => examined.has(String(item.id))
    ).length;

    let interrogatedCount = 0;
    let attemptsUsed = 0;
    let confession = false;

    const confessionIds = new Map([
        ["1", "1c"],
        ["6", "6c"],
        ["7", "7c"]
    ]);

    for (const suspect of suspects) {
        const id = String(suspect.id);
        const session = progress?.sessions?.[id];

        const used =
            typeof session?.attempts === "number" &&
                Number.isInteger(session.attempts)
                ? Math.max(0, Math.min(10, 10 - session.attempts))
                : 0;

        attemptsUsed += used;

        if (used > 0) {
            interrogatedCount++;
        }

        const required =
            id === "1" ? ["2", "4"] :
                id === "6" ? ["7"] : ["8"];

        const confessionId = confessionIds.get(id);
        const disclosures = session?.disclosureIds;
        const presented = session?.presentedEvidenceIds;

        if (
            correct &&
            id === suspectId &&
            used >= 3 &&
            confessionId &&
            Array.isArray(disclosures) &&
            disclosures.includes(confessionId) &&
            Array.isArray(presented) &&
            required.every(
                value => examined.has(value) &&
                    presented.includes(value)
            )
        ) {
            confession = true;
        }
    }

    const limit = suspects.length * 10;

    const efficiency = confession
        ? Math.round(
            50 * Math.max(
                0,
                Math.min(
                    1,
                    (limit - attemptsUsed) /
                    Math.max(1, limit / 2)
                )
            )
        )
        : 0;

    const breakdown = {
        accusation: correct ? 500 : 0,
        evidence: correct && evidence.length
            ? Math.round(150 * examinedCount / evidence.length)
            : 0,
        suspects: correct && suspects.length
            ? Math.round(100 * interrogatedCount / suspects.length)
            : 0,
        confession: confession ? 200 : 0,
        efficiency: correct ? efficiency : 0
    };

    const score = Object.values(breakdown).reduce(
        (sum, value) => sum + value,
        0
    );

    const rank =
        !correct ? "Investigație eșuată" :
            score >= 900 ? "Detectiv expert" :
                score >= 800 ? "Detectiv senior" :
                    score >= 650 ? "Detectiv experimentat" :
                        "Detectiv junior";

    return {
        score,
        rank,
        breakdown,
        examinedCount,
        interrogatedCount,
        attemptsUsed,
        confession
    };
}