"use client";

/**
 * ShipsBackground
 * Dense scattered ship‑icon watermark matching the reference image.
 * Ships are `position: fixed` — true viewport wallpaper.
 *
 * Ship files (in /public/patterns/):
 *   ship1.png – container / cargo ship
 *   ship2.png – front‑facing vessel
 *   ship3.png – cargo ship with crane / boom
 *   ship4.png – cruise / passenger liner
 */

// [left%, top%, filename, widthPx]
const SHIPS: [number, number, string, number][] = [
    // ── Row 1  (y ≈ 1‑4%) ───────────────────────────────────────────────
    [1,    2,   "ship3", 68],
    [11,   1.5, "ship4", 76],
    [21,   2.5, "ship1", 64],
    [31,   1,   "ship3", 70],
    [41,   2,   "ship2", 60],
    [51,   1.5, "ship4", 76],
    [61,   2,   "ship1", 64],
    [71,   1,   "ship3", 68],
    [81,   2,   "ship2", 60],
    [91,   1.5, "ship4", 74],

    // ── Row 2  (y ≈ 14‑17%) ─────────────────────────────────────────────
    [0,    14,  "ship1", 66],
    [8.5,  16,  "ship2", 60],
    [17,   15,  "ship3", 70],
    [26,   14,  "ship4", 76],
    [35,   16,  "ship1", 64],
    [44,   14,  "ship3", 68],
    [53,   15,  "ship2", 60],
    [62,   14,  "ship4", 74],
    [71,   16,  "ship1", 64],
    [80,   15,  "ship3", 70],
    [90,   14,  "ship2", 60],

    // ── Row 3  (y ≈ 26‑29%) ─────────────────────────────────────────────
    [2,    27,  "ship4", 76],
    [11,   28,  "ship3", 68],
    [20,   26,  "ship2", 60],
    [29,   28,  "ship1", 64],
    [38,   27,  "ship4", 74],
    [47,   28,  "ship3", 70],
    [56,   26,  "ship1", 64],
    [65,   28,  "ship2", 60],
    [74,   27,  "ship3", 68],
    [83,   26,  "ship4", 74],
    [92,   27,  "ship1", 64],

    // ── Row 4  (y ≈ 38‑41%) ─────────────────────────────────────────────
    [0,    39,  "ship2", 60],
    [9,    40,  "ship1", 66],
    [18,   38,  "ship3", 70],
    [27,   40,  "ship4", 76],
    [36,   39,  "ship2", 60],
    [45,   38,  "ship1", 64],
    [54,   40,  "ship3", 68],
    [63,   39,  "ship4", 74],
    [72,   38,  "ship2", 60],
    [81,   40,  "ship1", 64],
    [91,   39,  "ship3", 68],

    // ── Row 5  (y ≈ 50‑53%) ─────────────────────────────────────────────
    [3,    51,  "ship3", 68],
    [12,   52,  "ship4", 74],
    [21,   50,  "ship1", 64],
    [30,   52,  "ship2", 60],
    [39,   51,  "ship3", 70],
    [48,   50,  "ship4", 76],
    [57,   52,  "ship1", 64],
    [66,   51,  "ship2", 60],
    [75,   50,  "ship3", 68],
    [84,   52,  "ship4", 74],
    [93,   51,  "ship1", 64],

    // ── Row 6  (y ≈ 62‑65%) ─────────────────────────────────────────────
    [0.5,  63,  "ship4", 76],
    [9,    64,  "ship2", 60],
    [18,   62,  "ship1", 64],
    [27,   64,  "ship3", 70],
    [36,   63,  "ship4", 74],
    [45,   62,  "ship2", 60],
    [54,   64,  "ship3", 68],
    [63,   63,  "ship1", 64],
    [72,   62,  "ship4", 74],
    [81,   64,  "ship2", 60],
    [90,   63,  "ship3", 68],

    // ── Row 7  (y ≈ 74‑77%) ─────────────────────────────────────────────
    [2,    75,  "ship1", 66],
    [11,   76,  "ship3", 70],
    [20,   74,  "ship4", 76],
    [29,   76,  "ship2", 60],
    [38,   75,  "ship1", 64],
    [47,   74,  "ship3", 68],
    [56,   76,  "ship4", 74],
    [65,   75,  "ship2", 60],
    [74,   74,  "ship1", 64],
    [83,   76,  "ship3", 70],
    [92,   75,  "ship4", 74],

    // ── Row 8  (y ≈ 86‑89%) ─────────────────────────────────────────────
    [0,    87,  "ship3", 68],
    [9,    88,  "ship4", 74],
    [18,   86,  "ship2", 60],
    [27,   88,  "ship1", 64],
    [36,   87,  "ship3", 70],
    [45,   86,  "ship4", 76],
    [54,   88,  "ship2", 60],
    [63,   87,  "ship1", 64],
    [72,   86,  "ship3", 68],
    [81,   88,  "ship4", 74],
    [91,   87,  "ship2", 60],

    // ── Row 9 partial  (y ≈ 94‑97%) ────────────────────────────────────
    [4,    95,  "ship2", 60],
    [14,   96,  "ship3", 68],
    [24,   94,  "ship4", 74],
    [34,   96,  "ship1", 64],
    [44,   95,  "ship2", 60],
    [54,   94,  "ship3", 70],
    [64,   96,  "ship4", 74],
    [74,   95,  "ship1", 64],
    [84,   94,  "ship3", 68],
    [94,   95,  "ship2", 60],
];

export default function ShipsBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none select-none"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                overflow: "hidden",
            }}
        >
            {SHIPS.map(([left, top, src, width], i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={i}
                    src={`/patterns/${src}.png`}
                    alt=""
                    style={{
                        position: "absolute",
                        left:    `${left}%`,
                        top:     `${top}%`,
                        width:   width,
                        height:  "auto",
                        opacity: 0.15,
                    }}
                />
            ))}
        </div>
    );
}
