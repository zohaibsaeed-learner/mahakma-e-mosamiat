import { getWeatherIconUrl, formatDayLabel, toCityDate } from "../../utils/weather";

export function DailyForecast({ forecast }) {

    if (!forecast) {
        return (
            <section>
                <h2 className="mb-5 text-xl font-bold text-ink">Multi-Day Forecast</h2>
                <div className="flex h-36 animate-pulse items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-mist">
                    Loading forecast...
                </div>
            </section>
        );
    }

    const tzOffset = forecast.city.timezone;
    const dayBuckets = new Map();

    forecast.list.forEach((entry) => {
        const dateKey = entry.dt_txt.split(" ")[0];
        if (!dayBuckets.has(dateKey)) dayBuckets.set(dateKey, []);
        dayBuckets.get(dateKey).push(entry);
    });

    const dailyForecast = Array.from(dayBuckets.entries()).map(([dateKey, entries]) => {
        const temps = entries.map((entry) => entry.main.temp);
        const middayEntry = entries.reduce((closest, entry) => {
            const hour = Number(entry.dt_txt.split(" ")[1].split(":")[0]);
            const closestHour = Number(closest.dt_txt.split(" ")[1].split(":")[0]);
            return Math.abs(hour - 13) < Math.abs(closestHour - 13) ? entry : closest;
        });
        const avgRain = Math.round(
            (entries.reduce((sum, entry) => sum + (entry.pop || 0), 0) / entries.length) * 100
        );

        return {
            key: dateKey,
            day: formatDayLabel(toCityDate(middayEntry.dt, tzOffset)),
            max: Math.round(Math.max(...temps)),
            min: Math.round(Math.min(...temps)),
            condition: middayEntry.weather[0].main,
            iconUrl: getWeatherIconUrl(middayEntry.weather[0].icon),
            rain: avgRain,
        };
    });

    return (
        <section>
            <h2 className="mb-5 text-xl font-bold text-ink">Multi-Day Forecast</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                {dailyForecast.map((day) => (
                    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-orange/30 hover:bg-white/[0.06]" key={day.key}>
                        <p className="font-semibold text-emerald-light">{day.day}</p>
                        <img src={day.iconUrl} alt={day.condition} className="my-3 h-14 w-14 transition group-hover:scale-110" />
                        <p className="text-2xl font-bold text-ink">
                            {day.max}° <span className="text-sm font-normal text-mist">/ {day.min}°</span>
                        </p>
                        <p className="mt-1 truncate text-sm text-ink/70">{day.condition}</p>
                        <p className="mt-3 text-xs font-semibold text-orange">{day.rain}% rain</p>
                    </div>
                ))}
            </div>
        </section>
    );
}