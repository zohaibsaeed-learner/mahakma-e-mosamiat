import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const typedPhrase = "موسم کی کہانی، شاعر کی زبانی";

export function Dashboard() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTyped(typedPhrase.slice(0, index));
      if (index === typedPhrase.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="dashboard"
      className="starfield relative flex min-h-[calc(100vh-96px)] w-full flex-col justify-center overflow-hidden bg-night px-4 pb-16 sm:px-8 sm:pb-20"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald/10 blur-[120px] sm:h-96 sm:w-96 sm:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-orange/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[120px]" />

      <div className="relative mx-auto w-full max-w-4xl text-center">

        <span dir="rtl" className="urdu mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald/30 bg-emerald/5 px-3 py-1.5 text-xs font-medium text-emerald-light sm:mb-8 sm:px-4 sm:text-sm">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
          <span className="truncate">{typed}</span>
          <span className="type-caret text-emerald-light">|</span>
        </span>

        <h1 dir="rtl" className="urdu text-3xl leading-[1.9] text-ink sm:text-5xl sm:leading-[2] lg:text-7xl">
          محکمۂ موسمیات میں{" "}
          <span className="bg-gradient-to-r from-emerald-light to-emerald bg-clip-text text-transparent">
            خوش آمدید
          </span>
        </h1>

        <p dir="rtl" className="urdu mx-auto mt-6 max-w-3xl text-lg leading-[1.9] text-orange-light sm:mt-8 sm:text-2xl sm:leading-[2.1] lg:text-3xl">
          یوں ہی موسم کی ادا دیکھ کے یاد آیا
          <br />
          کس قدر جلد بدل جاتے ہیں انسان جاناں!
        </p>

        <p dir="rtl" className="urdu mt-3 text-base text-mist sm:mt-4 sm:text-lg">— احمد فراز</p>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-ink/70 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
          Search any city and get instant temperature, wind speed, humidity, and rain chances. Save your favorite cities and check a multi-day forecast, all in one place.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            to="/weather"
            className="w-full max-w-xs rounded-full bg-emerald px-7 py-3 text-sm font-semibold text-night transition hover:bg-emerald-light sm:w-auto sm:py-3.5 sm:text-base"
          >
            Check the Sky
          </Link>
          <Link
            to="/weather/details"
            className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-ink transition hover:border-orange/40 hover:text-orange-light sm:w-auto sm:py-3.5 sm:text-base"
          >
            Saved Locations
          </Link>
        </div>

      </div>
    </section>
  );
}