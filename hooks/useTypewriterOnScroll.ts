"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger a typewriter animation when an element scrolls into view.
 * @param lines Array of strings to animate line by line.
 * @param speed Typing speed per character in milliseconds.
 * @returns { ref, displayed, done }
 */
export function useTypewriterOnScroll(lines: string[], speed = 38) {
    const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''));
    const [done, setDone] = useState(false);
    const ref = useRef<HTMLElement | null>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    observer.disconnect();

                    let lineIdx = 0;
                    let charIdx = 0;

                    const tick = () => {
                        const currentLine = lines[lineIdx];
                        charIdx++;
                        setDisplayed(prev => {
                            const next = [...prev];
                            next[lineIdx] = currentLine.slice(0, charIdx);
                            return next;
                        });

                        if (charIdx < currentLine.length) {
                            setTimeout(tick, speed);
                        } else if (lineIdx < lines.length - 1) {
                            lineIdx++;
                            charIdx = 0;
                            setTimeout(tick, speed * 8); // pause between lines
                        } else {
                            setDone(true);
                        }
                    };

                    setTimeout(tick, 400); // brief pause before starting
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [lines, speed]);

    return { ref, displayed, done };
}
