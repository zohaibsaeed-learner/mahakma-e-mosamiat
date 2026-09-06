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
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]">

        {hasDetails && (
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-light">
              Weather Information
            </p>

            <h1 className="mb-10 text-3xl font-bold text-ink sm:text-4xl">
              {weatherData.name}
            </h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <article className="flex min-h-64 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
            <div>
              <p className="text-xl font-semibold text-ink/80">No city selected</p>
              <p className="mt-2 text-mist">Search for a city to view its weather details.</p>
            </div>
          </article>
        )}

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <h2 className="mb-6 text-2xl font-bold text-emerald-light">Saved Locations</h2>

          {savedLocations.length === 0 ? (
            <p className="text-mist">No saved locations yet.</p>
          ) : (
            <div className="space-y-3">
              {savedLocations.map((city) => (
                <Link
                  key={city.id}
                  to="/weather"
                  state={{ selectedCity: city }}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 font-semibold text-ink/90 transition hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald-light"
                >
                  {city.name}
                  <FaBookmark className="text-xs opacity-60" />
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-emerald/30 hover:bg-white/[0.05]">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-mist">{title}</h2>
      <p className="mt-2 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}