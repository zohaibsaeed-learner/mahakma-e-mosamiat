import { getWeatherIconUrl, formatDayLabel, toCityDate } from "../../utils/weather";

export function DailyForecast({ forecast }) {

    if (!forecast) {
        return (
            <section>
                <h2 className="mb-4 text-lg font-bold text-ink sm:mb-5 sm:text-xl">Multi-Day Forecast</h2>
                <div className="flex h-32 animate-pulse items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-mist">
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
            <h2 className="mb-4 text-lg font-bold text-ink sm:mb-5 sm:text-xl">Multi-Day Forecast</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
                {dailyForecast.map((day) => (
                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-orange/30 hover:bg-white/[0.06] sm:rounded-3xl sm:p-5" key={day.key}>
                        <p className="text-sm font-semibold text-emerald-light sm:text-base">{day.day}</p>
                        <img src={day.iconUrl} alt={day.condition} className="my-2 h-10 w-10 transition group-hover:scale-110 sm:my-3 sm:h-14 sm:w-14" />
                        <p className="text-lg font-bold text-ink sm:text-2xl">
                            {day.max}° <span className="text-xs font-normal text-mist sm:text-sm">/ {day.min}°</span>
                        </p>
                        <p className="mt-1 truncate text-xs text-ink/70 sm:text-sm">{day.condition}</p>
                        <p className="mt-2 text-xs font-semibold text-orange sm:mt-3">{day.rain}% rain</p>
                    </div>
                ))}
            </div>
        </section>
    );
}