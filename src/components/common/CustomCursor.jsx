import { useEffect, useRef } from "react";

export function CustomCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        let lastSpawn = 0;

        function handleMove(e) {
            if (!cursor) return;
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

            const now = performance.now();
            if (now - lastSpawn < 30) return;
            lastSpawn = now;

            const drop = document.createElement("span");
            drop.className = "cursor-drop";
            drop.style.left = `${e.clientX + (Math.random() - 0.5) * 12}px`;
            drop.style.top = `${e.clientY + (Math.random() - 0.5) * 12}px`;
            drop.style.background = Math.random() > 0.5 ? "var(--color-orange-light)" : "var(--color-emerald-light)";
            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 650);
        }

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return <div ref={cursorRef} className="cursor-dot" />;
}