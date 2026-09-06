export function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function toCityDate(unixSeconds, timezoneOffsetSeconds) {
    return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
}

export function formatHourLabel(date) {
    let hours = date.getUTCHours();
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours} ${suffix}`;
}

export function formatDayLabel(date) {
    return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function formatClockTime(unixSeconds, timezoneOffsetSeconds) {
    return formatHourLabel(toCityDate(unixSeconds, timezoneOffsetSeconds));
}

export function aqiLabel(aqi) {
    const labels = { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor" };
    return labels[aqi] || "Unknown";
}