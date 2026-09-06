// components/common/Header.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border px-6 py-3 transition-all duration-300 ${isScrolled
            ? "border-emerald/15 bg-night/80 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "border-transparent bg-transparent"
          }`}
      >
        <Link to="/" className="font-serif text-base font-medium tracking-wide text-emerald-300">
          Mahakma e Mosamiat
        </Link>

        <div className="flex items-center gap-1 text-sm text-mist">
          <Link to="/" className="rounded-full px-3 py-1.5 transition hover:bg-emerald/10 hover:text-emerald-light">
            Dashboard
          </Link>
          <Link to="/weather" className="rounded-full px-3 py-1.5 transition hover:bg-orange/10 hover:text-orange-light">
            Weather
          </Link>
          <Link to="/weather/details" className="rounded-full px-3 py-1.5 transition hover:bg-emerald/10 hover:text-emerald-light">
            Saved Locations
          </Link>
        </div>
      </nav>
    </div>
  );
}