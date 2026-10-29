/**
 * Momentele exacte ale fazelor principale ale Lunii (luna noua, primul patrar,
 * luna plina, ultimul patrar), dupa Meeus, "Astronomical Algorithms", cap. 49.
 * Precizie: 1-2 minute fata de tabelele NASA, deci ziua afisata e corecta
 * chiar si cand faza cade aproape de miezul noptii.
 *
 * Varsta medie a Lunii (getMoonage) poate gresi faza cu pana la o zi, asa ca
 * nu o folosi pentru date de luna plina / luna noua.
 */

export type PrincipalPhase = 'new' | 'first-quarter' | 'full' | 'last-quarter';

export interface PhaseEvent {
    phase: PrincipalPhase;
    date: Date;
}

export const PHASE_NAMES_RO: Record<PrincipalPhase, string> = {
    'new': 'Lună Nouă',
    'first-quarter': 'Primul Pătrar',
    'full': 'Lună Plină',
    'last-quarter': 'Ultimul Pătrar',
};

const PHASE_OFFSET: Record<PrincipalPhase, number> = { 'new': 0, 'first-quarter': 0.25, 'full': 0.5, 'last-quarter': 0.75 };
const SYNODIC_MONTH = 29.530588861;
const DELTA_T_DAYS = 69 / 86400; // TT - UT, ~69 s in 2026
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Instant of the phase for lunation k (k = 0 is the new moon of 6 Jan 2000). */
function phaseInstant(k: number, phase: PrincipalPhase): Date {
    const T = k / 1236.85;
    const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    let jde = 2451550.09766 + SYNODIC_MONTH * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;

    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
    const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
    const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
    const O = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);
    const sin = Math.sin, cos = Math.cos;

    if (phase === 'new' || phase === 'full') {
        const n = phase === 'new';
        jde += (n ? -0.4072 : -0.40614) * sin(Mp)
            + (n ? 0.17241 : 0.17302) * E * sin(M)
            + (n ? 0.01608 : 0.01614) * sin(2 * Mp)
            + (n ? 0.01039 : 0.01043) * sin(2 * F)
            + (n ? 0.00739 : 0.00734) * E * sin(Mp - M)
            - (n ? 0.00514 : 0.00515) * E * sin(Mp + M)
            + (n ? 0.00208 : 0.00209) * E * E * sin(2 * M)
            - 0.00111 * sin(Mp - 2 * F)
            - 0.00057 * sin(Mp + 2 * F)
            + 0.00056 * E * sin(2 * Mp + M)
            - 0.00042 * sin(3 * Mp)
            + 0.00042 * E * sin(M + 2 * F)
            + 0.00038 * E * sin(M - 2 * F)
            - 0.00024 * E * sin(2 * Mp - M)
            - 0.00017 * sin(O)
            - 0.00007 * sin(Mp + 2 * M)
            + 0.00004 * sin(2 * Mp - 2 * F)
            + 0.00004 * sin(3 * M)
            + 0.00003 * sin(Mp + M - 2 * F)
            + 0.00003 * sin(2 * Mp + 2 * F)
            - 0.00003 * sin(Mp + M + 2 * F)
            + 0.00003 * sin(Mp - M + 2 * F)
            - 0.00002 * sin(Mp - M - 2 * F)
            - 0.00002 * sin(3 * Mp + M)
            + 0.00002 * sin(4 * Mp);
    } else {
        jde += -0.62801 * sin(Mp)
            + 0.17172 * E * sin(M)
            - 0.01183 * E * sin(Mp + M)
            + 0.00862 * sin(2 * Mp)
            + 0.00804 * sin(2 * F)
            + 0.00454 * E * sin(Mp - M)
            + 0.00204 * E * E * sin(2 * M)
            - 0.0018 * sin(Mp - 2 * F)
            - 0.0007 * sin(Mp + 2 * F)
            - 0.0004 * sin(3 * Mp)
            - 0.00034 * E * sin(2 * Mp - M)
            + 0.00032 * E * sin(M + 2 * F)
            + 0.00032 * E * sin(M - 2 * F)
            - 0.00028 * E * E * sin(Mp + 2 * M)
            + 0.00027 * E * sin(2 * Mp + M)
            - 0.00017 * sin(O)
            - 0.00005 * sin(Mp - M - 2 * F)
            + 0.00004 * sin(2 * Mp + 2 * F)
            - 0.00004 * sin(Mp + M + 2 * F)
            + 0.00004 * sin(Mp - 2 * M)
            + 0.00003 * sin(Mp + M - 2 * F)
            + 0.00003 * sin(3 * M)
            + 0.00002 * sin(2 * Mp - 2 * F)
            + 0.00002 * sin(Mp - M + 2 * F)
            - 0.00002 * sin(3 * Mp + M);
        const W = 0.00306 - 0.00038 * E * cos(M) + 0.00026 * cos(Mp) - 0.00002 * cos(Mp - M) + 0.00002 * cos(Mp + M) + 0.00002 * cos(2 * F);
        jde += phase === 'first-quarter' ? W : -W;
    }

    // Planetary arguments, common to all phases.
    const A: [number, number, number][] = [
        [0.000325, 299.77, 0.107408], [0.000165, 251.88, 0.016321], [0.000164, 251.83, 26.651886],
        [0.000126, 349.42, 36.412478], [0.00011, 84.66, 18.206239], [0.000062, 141.74, 53.303771],
        [0.00006, 207.14, 2.453732], [0.000056, 154.84, 7.30686], [0.000047, 34.52, 27.261239],
        [0.000042, 207.19, 0.121824], [0.00004, 291.34, 1.844379], [0.000037, 161.72, 24.198154],
        [0.000035, 239.56, 25.513099], [0.000023, 331.55, 3.592518],
    ];
    A.forEach(([coef, base, rate], i) => {
        jde += coef * sin(rad(base + rate * k - (i === 0 ? 0.009173 * T2 : 0)));
    });

    return new Date((jde - DELTA_T_DAYS - 2440587.5) * 86400000);
}

/** All principal phases whose instant falls in [from, to), in time order. */
export function moonPhasesBetween(from: Date, to: Date): PhaseEvent[] {
    const k0 = Math.floor((from.getTime() / 86400000 + 2440587.5 - 2451550.09766) / SYNODIC_MONTH) - 1;
    const events: PhaseEvent[] = [];
    for (let k = k0; ; k++) {
        for (const phase of Object.keys(PHASE_OFFSET) as PrincipalPhase[]) {
            const date = phaseInstant(k + PHASE_OFFSET[phase], phase);
            if (date >= to) return events;
            if (date >= from) events.push({ phase, date });
        }
    }
}

/** The first instant of `phase` after `after`. */
export function nextMoonPhase(phase: PrincipalPhase, after: Date): Date {
    const window = new Date(after.getTime() + 31 * 86400000);
    return moonPhasesBetween(after, window).find((e) => e.phase === phase)!.date;
}
