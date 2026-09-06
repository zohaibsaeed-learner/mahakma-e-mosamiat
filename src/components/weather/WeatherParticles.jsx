import { useEffect, useRef } from "react";

const PARTICLE_MAP = {
    Clear: { glyphs: ["☀️"], size: [16, 24] },
    Clouds: { glyphs: ["☁️"], size: [16, 26] },
    Rain: { glyphs: ["🌧️"], size: [14, 20] },
    Drizzle: { glyphs: ["🌦️"], size: [14, 20] },
    Thunderstorm: { glyphs: ["⛈️"], size: [16, 24] },
    Snow: { glyphs: ["❄️"], size: [12, 18] },
    Mist: { glyphs: ["🌫️"], size: [16, 24] },
    Haze: { glyphs: ["🌫️"], size: [16, 24] },
    Fog: { glyphs: ["🌫️"], size: [16, 24] },
    Smoke: { glyphs: ["🌫️"], size: [16, 24] },
    Dust: { glyphs: ["🌪️"], size: [14, 20] },
    Sand: { glyphs: ["🌪️"], size: [14, 20] },
    Squall: { glyphs: ["💨"], size: [14, 20] },
    Tornado: { glyphs: ["🌪️"], size: [18, 26] },
};

const MAX_PARTICLES = 14;

export function WeatherParticles({ condition, containerRef, horizontalScrollRef }) {
    const layerRef = useRef(null);
    const verticalAccumRef = useRef(0);
    const horizontalAccumRef = useRef(0);
    const activeCountRef = useRef(0);

    useEffect(() => {
        const config = PARTICLE_MAP[condition];
        if (!config || !containerRef.current || !layerRef.current) return;

        function isInView() {
            const rect = containerRef.current.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }

        function spawnParticle() {
            const layer = layerRef.current;
            if (!layer || activeCountRef.current >= MAX_PARTICLES) return;

            const [minSize, maxSize] = config.size;
            const particle = document.createElement("span");
            particle.textContent = config.glyphs[Math.floor(Math.random() * config.glyphs.length)];
            particle.style.position = "absolute";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = "-8%";
            particle.style.fontSize = `${minSize + Math.random() * (maxSize - minSize)}px`;
            particle.style.opacity = "0.95";
            particle.style.pointerEvents = "none";
            particle.style.willChange = "transform, opacity";
            particle.style.zIndex = "40";

            const duration = 1400 + Math.random() * 900;
            const drift = (Math.random() - 0.5) * 50;

            layer.appendChild(particle);
            activeCountRef.current += 1;

            const animation = particle.animate(
                [
                    { transform: "translate(0, 0)", opacity: 0.95 },
                    { transform: `translate(${drift}px, 220px)`, opacity: 0 },
                ],
                { duration, easing: "ease-in" }
            );

            animation.onfinish = () => {
                particle.remove();
                activeCountRef.current -= 1;
            };
        }

        let lastScrollY = window.scrollY;

        function handleVerticalScroll() {
            const currentScrollY = window.scrollY;
            const delta = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;

            if (!isInView()) return;

            verticalAccumRef.current += delta;

            const spawnThreshold = 45;
            while (verticalAccumRef.current >= spawnThreshold) {
                spawnParticle();
                verticalAccumRef.current -= spawnThreshold;
            }
        }

        window.addEventListener("scroll", handleVerticalScroll, { passive: true });

        let horizontalElement = null;
        let lastScrollX = 0;
        let handleHorizontalScroll = null;

        if (horizontalScrollRef?.current) {
            horizontalElement = horizontalScrollRef.current;
            lastScrollX = horizontalElement.scrollLeft;

            handleHorizontalScroll = () => {
                const currentScrollX = horizontalElement.scrollLeft;
                const delta = Math.abs(currentScrollX - lastScrollX);
                lastScrollX = currentScrollX;

                if (!isInView()) return;

                horizontalAccumRef.current += delta;

                const spawnThreshold = 35;
                while (horizontalAccumRef.current >= spawnThreshold) {
                    spawnParticle();
                    horizontalAccumRef.current -= spawnThreshold;
                }
            };

            horizontalElement.addEventListener("scroll", handleHorizontalScroll, { passive: true });
        }

        return () => {
            window.removeEventListener("scroll", handleVerticalScroll);
            if (horizontalElement && handleHorizontalScroll) {
                horizontalElement.removeEventListener("scroll", handleHorizontalScroll);
            }
        };
    }, [condition, containerRef, horizontalScrollRef]);

    if (!PARTICLE_MAP[condition]) return null;

    return (
        <div
            ref={layerRef}
            className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
        />
    );
}