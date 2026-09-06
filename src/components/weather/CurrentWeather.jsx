import { useEffect, useState } from "react";
import { getWeatherIconUrl } from "../../utils/weather";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

export function CurrentWeather({ selectedCity, weatherData }) {
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
            <div className="flex h-48 animate-pulse items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-mist">
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
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-2xl shadow-black/40">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />

                <div className="relative flex flex-col gap-10 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex-1">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-orange-light">
                            Current Weather
                        </p>

                        <h1 className="text-4xl font-bold text-ink sm:text-5xl">
                            {weatherData.name}
                        </h1>

                        <div className="mt-6 flex items-end gap-2">
                            <p className="text-8xl font-bold tracking-tight text-ink sm:text-9xl">
                                {temperature.toFixed(0)}
                            </p>
                            <span className="mb-4 text-3xl font-medium text-mist sm:text-4xl">
                                °{isFahrenheit ? "F" : "C"}
                            </span>
                        </div>

                        <p className="mt-1 text-lg capitalize text-ink/70">{description}</p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsFahrenheit(!isFahrenheit)}
                                className="rounded-full border border-emerald/30 bg-emerald/5 px-5 py-2.5 text-sm font-semibold text-emerald-light transition hover:bg-emerald hover:text-night"
                            >
                                °C ↔ °F
                            </button>
                            <span className="rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium capitalize text-ink/80">
                                {condition}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-10 py-10">
                        <img src={iconUrl} alt={condition} className="h-32 w-32 drop-shadow-2xl sm:h-40 sm:w-40" />

                        <button
                            onClick={toggleSaveLocation}
                            className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition ${isSaved
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
                <div className="fixed top-24 right-6 z-50 rounded-2xl border border-emerald/20 bg-night/95 px-5 py-3.5 text-sm font-semibold text-emerald-light shadow-2xl shadow-black/50 backdrop-blur-xl">
                    {toast}
                </div>
            )}
        </>
    );
}