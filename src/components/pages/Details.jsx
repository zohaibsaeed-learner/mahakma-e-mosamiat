import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatClockTime, aqiLabel } from "../../utils/weather";
import { FaArrowLeft, FaBookmark } from "react-icons/fa6";

export function Details() {
  const location = useLocation();
  const selectedCity = location.state?.selectedCity;
  const weatherData = location.state?.weatherData;

  const [savedLocations] = useState(() => {
    const saved = localStorage.getItem("savedLocations");
    return saved ? JSON.parse(saved) : [];
  });

  const [airQuality, setAirQuality] = useState(null);

  useEffect(() => {
    if (!weatherData?.coord) return;

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const { lat, lon } = weatherData.coord;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => setAirQuality(data.list?.[0]?.main?.aqi ?? null))
      .catch(() => setAirQuality(null));
  }, [weatherData]);

  const hasDetails = Boolean(selectedCity && weatherData);

  return (
    <section
      id="details"
      className="min-h-screen bg-night px-4 pb-20 pt-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">

        {hasDetails && (
          <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-light sm:tracking-[0.3em]">
              Weather Information
            </p>

            <h1 className="mb-8 truncate text-2xl font-bold text-ink sm:mb-10 sm:text-3xl lg:text-4xl">
              {weatherData.name}
            </h1>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <DetailCard title="Feels Like" value={`${weatherData.main.feels_like.toFixed(1)}°C`} />
              <DetailCard title="Humidity" value={`${weatherData.main.humidity}%`} />
              <DetailCard title="Wind Speed" value={`${weatherData.wind.speed} m/s`} />
              <DetailCard title="Pressure" value={`${weatherData.main.pressure} hPa`} />
              <DetailCard title="Visibility" value={`${(weatherData.visibility / 1000).toFixed(1)} km`} />
              <DetailCard title="Sunrise" value={formatClockTime(weatherData.sys.sunrise, weatherData.timezone)} />
              <DetailCard title="Sunset" value={formatClockTime(weatherData.sys.sunset, weatherData.timezone)} />
              <DetailCard title="UV Index" value="Not available" />
              <DetailCard title="Air Quality" value={airQuality ? aqiLabel(airQuality) : "Loading..."} />
            </div>
          </article>
        )}

        {!hasDetails && (
          <article className="flex min-h-56 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-8 text-center sm:min-h-64 sm:rounded-[2rem] sm:p-10">
            <div>
              <p className="text-lg font-semibold text-ink/80 sm:text-xl">No city selected</p>
              <p className="mt-2 text-sm text-mist sm:text-base">Search for a city to view its weather details.</p>
            </div>
          </article>
        )}

        <aside className="h-fit rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
          <h2 className="mb-5 text-xl font-bold text-emerald-light sm:mb-6 sm:text-2xl">Saved Locations</h2>

          {savedLocations.length === 0 ? (
            <p className="text-sm text-mist sm:text-base">No saved locations yet.</p>
          ) : (
            <div className="space-y-3">
              {savedLocations.map((city) => (
                <Link
                  key={city.id}
                  to="/weather"
                  state={{ selectedCity: city }}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-ink/90 transition hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald-light sm:px-5 sm:py-3.5 sm:text-base"
                >
                  <span className="truncate">{city.name}</span>
                  <FaBookmark className="ml-2 shrink-0 text-xs opacity-60" />
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/weather"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-orange-light transition hover:text-orange"
          >
            <FaArrowLeft /> Back to Weather
          </Link>
        </aside>

      </div>
    </section>
  );
}

function DetailCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-emerald/30 hover:bg-white/[0.05] sm:p-5">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-mist sm:text-xs">{title}</h2>
      <p className="mt-1.5 truncate text-lg font-bold text-ink sm:mt-2 sm:text-xl">{value}</p>
    </div>
  );
}