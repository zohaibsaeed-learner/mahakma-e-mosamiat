import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CurrentWeather } from "../weather/CurrentWeather";
import cities from "../../data/cities";
import { HourlyForecast } from "../weather/HourlyForecast";
import { DailyForecast } from "../weather/DailyForecast";
import { FaMagnifyingGlass, FaArrowRight } from "react-icons/fa6";

export function Weather() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(location.state?.selectedCity || null);
  const [weatherData, setWeatherData] = useState(location.state?.weatherData || null);
  const [forecast, setForecast] = useState(location.state?.forecast || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredCity = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!selectedCity) return;
    if (weatherData && weatherData.name === selectedCity.name) return;

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name},${selectedCity.country}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.name},${selectedCity.country}&appid=${apiKey}&units=metric`;

    setLoading(true);
    setError("");
    setWeatherData(null);
    setForecast(null);

    Promise.all([
      fetch(currentUrl).then((response) => response.json()),
      fetch(forecastUrl).then((response) => response.json()),
    ])
      .then(([current, forecastResponse]) => {
        if (current.cod !== 200) {
          setError(current.message || "City not found.");
          return;
        }
        setWeatherData(current);
        setForecast(forecastResponse);
      })
      .catch(() => setError("Couldn't reach the weather service."))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  return (
    <section
      id="weather"
      className="min-h-screen w-full overflow-x-hidden bg-night px-4 pb-20 pt-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">

        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-light">
            Live Conditions
          </p>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">
            Search any city for weather
          </h1>
          <p className="mt-3 text-mist">
            Find current conditions and a clear forecast for the days ahead.
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <FaMagnifyingGlass className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-ink outline-none backdrop-blur-sm transition placeholder:text-mist focus:border-emerald/50 focus:ring-4 focus:ring-emerald/10"
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <div className="absolute inset-x-0 top-full z-20 mt-3 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-night/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <ul>
                {filteredCity.length > 0 ? (
                  filteredCity.map((city) => (
                    <li
                      key={city.id}
                      className="cursor-pointer border-b border-white/5 px-5 py-3.5 text-sm text-ink/90 transition last:border-0 hover:bg-emerald/10 hover:text-emerald-light"
                      onClick={() => {
                        setSelectedCity(city);
                        setQuery("");
                      }}
                    >
                      {city.name} <span className="text-mist">({city.country})</span>
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-4 text-sm text-mist">No city found.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm font-medium text-red-300">
            {error}
          </p>
        )}

        {selectedCity && !error && (
          <div className="mt-12 space-y-12">
            <CurrentWeather selectedCity={selectedCity} weatherData={weatherData} />
            <HourlyForecast forecast={forecast} />
            <DailyForecast forecast={forecast} />

            <Link
              to="/weather/details"
              state={{ selectedCity, weatherData, forecast }}
              className="group inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3.5 text-sm font-bold text-night transition hover:bg-emerald-light"
            >
              More Details
              <FaArrowRight className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}