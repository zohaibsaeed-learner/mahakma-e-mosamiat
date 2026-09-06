import { getWeatherIconUrl, formatClockTime } from "../../utils/weather";

export function HourlyForecast({ forecast }) {

    if (!forecast) {
        return (
            <section>
                <h2 className="mb-5 text-xl font-bold text-ink">Hourly Forecast</h2>
                <div className="flex h-48 animate-pulse items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-mist">
                    Loading forecast...
                </div>
            </section>
        );
    }

    const tzOffset = forecast.city.timezone;
    const hourlyForecast = forecast.list.slice(0, 8).map((entry) => ({
        time: formatClockTime(entry.dt, tzOffset),
        temperature: entry.main.temp,
        condition: entry.weather[0].main,
        iconUrl: getWeatherIconUrl(entry.weather[0].icon),
        rain: Math.round((entry.pop || 0) * 100),
    }));

    const temperatures = hourlyForecast.map((hour) => hour.temperature);
    const minimumTemperature = Math.min(...temperatures);
    const maximumTemperature = Math.max(...temperatures);
    const scaleHalfRange = Math.max(10, Math.ceil(Math.max(Math.abs(maximumTemperature - 20), Math.abs(minimumTemperature - 20)) / 5) * 5);
    const scaleMinimum = 20 - scaleHalfRange;
    const scaleMaximum = 20 + scaleHalfRange;
    const temperatureRange = scaleMaximum - scaleMinimum;
    const scaleLabels = [scaleMaximum, scaleMaximum - scaleHalfRange / 2, 20, scaleMinimum + scaleHalfRange / 2, scaleMinimum];
    const graphPoints = hourlyForecast.map((hour, index) => {
        const x = (index / (hourlyForecast.length - 1)) * 100;
        const y = 88 - ((hour.temperature - scaleMinimum) / temperatureRange) * 68;
        return `${x},${y}`;
    }).join(" ");

    return (
        <section>
            <h2 className="mb-5 text-xl font-bold text-ink">Hourly Forecast</h2>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-3 pb-5 pt-4 shadow-[0_0_32px_rgba(52,211,153,0.06)] sm:px-6">
                <div className="relative pt-12">
                    <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-11 text-[10px] text-mist sm:w-14 sm:text-xs">
                        {scaleLabels.map((label) => {
                            const position = 12 + ((label - scaleMinimum) / temperatureRange) * 68;
                            return <span className="absolute right-1 -translate-y-1/2" style={{ bottom: `${position}%` }} key={label}>{label}°</span>;
                        })}
                    </div>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 top-12 ml-12 h-56 w-[calc(100%-3rem)] overflow-visible sm:ml-14 sm:w-[calc(100%-3.5rem)]" aria-hidden="true">
                        {scaleLabels.map((label) => {
                            const y = 88 - ((label - scaleMinimum) / temperatureRange) * 68;
                            return <line x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.3" className={label === 20 ? "text-orange/40" : "text-white/5"} key={label} />;
                        })}
                        <polyline points={graphPoints} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-emerald drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                    </svg>
                    <div className="relative ml-12 h-72 sm:ml-14">
                        {hourlyForecast.map((hour, index) => {
                            const left = (index / (hourlyForecast.length - 1)) * 100;
                            const bottom = 12 + ((hour.temperature - scaleMinimum) / temperatureRange) * 68;
                            return (
                                <div className="group absolute bottom-0 flex h-full w-16 -translate-x-1/2 flex-col items-center justify-end" style={{ left: `${left}%` }} key={hour.time + index} tabIndex="0">
                                    <div className="pointer-events-none absolute bottom-[calc(12%+68%)] z-10 mb-3 w-36 -translate-x-0 rounded-2xl border border-emerald/30 bg-night/95 p-3 text-center opacity-0 shadow-2xl backdrop-blur-xl transition duration-200 group-hover:opacity-100 group-focus:opacity-100">
                                        <p className="text-xs text-mist">{hour.time}</p>
                                        <p className="mt-1 text-lg font-bold text-ink">{hour.temperature.toFixed(0)}°C</p>
                                        <img src={hour.iconUrl} alt={hour.condition} className="mx-auto h-8 w-8" />
                                        <p className="mt-1 text-xs text-ink/70">{hour.condition}</p>
                                        <p className="mt-1 text-xs font-semibold text-orange-light">{hour.rain}% rain</p>
                                    </div>
                                    <span className="absolute h-3 w-3 rounded-full border-2 border-night bg-emerald shadow-[0_0_0_4px_rgba(52,211,153,0.15)] transition group-hover:scale-150 group-hover:bg-orange-light group-focus:scale-150" style={{ bottom: `${bottom}%` }} />
                                    <span className="mt-3 text-xs text-mist">{hour.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <p className="mt-2 text-center text-xs text-orange/80">Hover over a point to view conditions</p>
            </div>
        </section>
    );
}