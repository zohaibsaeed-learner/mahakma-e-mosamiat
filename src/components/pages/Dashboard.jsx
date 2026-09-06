// components/pages/Dashboard.jsx
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
      className="starfield relative flex min-h-[calc(100vh-96px)] w-full flex-col justify-center overflow-hidden bg-night px-5 pb-20 sm:px-8"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-4xl text-center">

        <span dir="rtl" className="urdu mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/5 px-4 py-1.5 text-sm font-medium text-emerald-light">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          {typed}
          <span className="type-caret text-emerald-light">|</span>
        </span>

        <h1 dir="rtl" className="urdu text-4xl leading-[2] text-emerald-300 sm:text-6xl lg:text-7xl">
          محکمۂ موسمیات میں{" "}
            خوش آمدید!
          
        </h1>

        <p dir="rtl" className="urdu mx-auto mt-8 max-w-3xl text-2xl leading-[2.1] text-orange-light sm:text-3xl">
          یوں ہی موسم کی ادا دیکھ کے یاد آیا
          <br />
          کس قدر جلد بدل جاتے ہیں انسان جاناں!
        </p>

        <p dir="rtl" className="urdu mt-4 text-lg text-emerald-300">— احمد فراز</p>

        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-ink/90 sm:text-lg">
          Search any city and get instant temperature, wind speed, humidity, and rain chances. Save your favorite cities and check a multi-day forecast, all in one place.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/weather"
            className="flex items-center gap-2 rounded-full bg-emerald-300 px-7 py-3.5 font-semibold text-night transition duration-300 hover:scale-110 active:scale-95 hover:bg-emerald-400"
          >
            Check the Sky
          </Link>
          <Link
            to="/weather/details"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-ink transition hover:border-orange/40 hover:text-orange hover:scale-110 active:scale-95"
          >
            Saved Locations
          </Link>
        </div>

      </div>
    </section>
  );
}