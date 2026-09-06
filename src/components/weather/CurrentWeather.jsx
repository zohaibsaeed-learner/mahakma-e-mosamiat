import { useEffect, useRef, useState } from "react";
import { getWeatherIconUrl } from "../../utils/weather";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { WeatherParticles } from "./WeatherParticles";

export function CurrentWeather({ selectedCity, weatherData }) {
    const cardRef = useRef(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isFahrenheit, setIsFahrenheit] = useState(false);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
        setIsSaved(savedLocations.some((city) => city.id === selectedCity.id));
    }, [selectedCity]);

    function toggleSaveLocation() {
        const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
        const alreadySaved = savedLocations.some((city) => city.id === selectedCity.id);

        if (alreadySaved) {
            const updatedLocations = savedLocations.filter((city) => city.id !== selectedCity.id);
            localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
            setIsSaved(false);
            showToast(`${selectedCity.name} removed from saved locations.`);
        } else {
            const updatedLocations = [...savedLocations, selectedCity];
            localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
            setIsSaved(true);
            showToast(`${selectedCity.name} saved successfully!`);
        }
    }

    function showToast(message) {
        setToast(message);
        setTimeout(() => setToast(""), 3500);
    }

    if (!weatherData) {
        return (
            <div className="flex h-40 animate-pulse items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-mist sm:h-48">
                Loading weather...
            </div>
        );
    }

    const tempCelsius = weatherData.main.temp;
    const temperature = isFahrenheit ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
    const condition = weatherData.weather[0].main;
    const description = weatherData.weather[0].description;
    const iconUrl = getWeatherIconUrl(weatherData.weather[0].icon);

    return (
        <>
            <div ref={cardRef} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface shadow-2xl shadow-black/40 sm:rounded-[2rem]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald/10 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-orange/10 blur-3xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72" />
                <WeatherParticles condition={condition} containerRef={cardRef} />

                <div className="relative flex flex-col gap-8 p-5 sm:gap-10 sm:p-8 md:p-10 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-light sm:mb-3 sm:tracking-[0.3em]">
                            Current Weather
                        </p>

                        <h1 className="truncate text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
                            {weatherData.name}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-end gap-2 sm:mt-6">
                            <p className="text-6xl font-bold tracking-tight text-ink sm:text-8xl lg:text-9xl">
                                {temperature.toFixed(0)}
                            </p>
                            <span className="mb-2 text-2xl font-medium text-mist sm:mb-4 sm:text-4xl">
                                °{isFahrenheit ? "F" : "C"}
                            </span>
                        </div>

                        <p className="mt-1 text-base capitalize text-ink/70 sm:text-lg">{description}</p>

                        <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                            <button
                                onClick={() => setIsFahrenheit(!isFahrenheit)}
                                className="rounded-full border border-emerald/30 bg-emerald/5 px-4 py-2 text-xs font-semibold text-emerald-light transition hover:bg-emerald hover:text-night sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                °C ↔ °F
                            </button>
                            <span className="rounded-full bg-white/5 px-4 py-2 text-xs font-medium capitalize text-ink/80 sm:px-5 sm:py-2.5 sm:text-sm">
                                {condition}
                            </span>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-7 sm:w-auto sm:rounded-[1.75rem] sm:px-10 sm:py-10">
                        <img src={iconUrl} alt={condition} className="h-20 w-20 drop-shadow-2xl sm:h-32 sm:w-32 lg:h-40 lg:w-40" />

                        <button
                            onClick={toggleSaveLocation}
                            className={`flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition sm:w-auto sm:px-6 sm:py-3 sm:text-sm ${isSaved
                                ? "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400 hover:text-white"
                                : "border-orange/30 bg-orange/10 text-orange-light hover:bg-orange hover:text-night"
                                }`}
                        >
                            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                            {isSaved ? "Saved" : "Save Location"}
                        </button>
                    </div>

                </div>
            </div>

            {toast && (
                <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-xs -translate-x-1/2 rounded-2xl border border-emerald/20 bg-night/95 px-5 py-3.5 text-center text-sm font-semibold text-emerald-light shadow-2xl shadow-black/50 backdrop-blur-xl sm:bottom-auto sm:left-auto sm:top-24 sm:right-6 sm:w-auto sm:max-w-none sm:translate-x-0 sm:text-left">
                    {toast}
                </div>
            )}
        </>
    );
}