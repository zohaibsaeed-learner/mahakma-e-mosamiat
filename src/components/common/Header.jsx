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
    <div className="sticky top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border px-4 py-2.5 transition-all duration-300 sm:gap-4 sm:px-6 sm:py-3 ${isScrolled
            ? "border-emerald/15 bg-night/80 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "border-transparent bg-transparent"
          }`}
      >
        <Link to="/" className="truncate text-sm font-semibold tracking-wide text-ink sm:text-base">
          Mahakma-e-Mosamiat
        </Link>

        <div className="flex shrink-0 items-center gap-0.5 text-xs text-mist sm:gap-1 sm:text-sm">
          <Link to="/" className="rounded-full px-2.5 py-1.5 transition hover:bg-emerald/10 hover:text-emerald-light sm:px-3">
            Dashboard
          </Link>
          <Link to="/weather" className="rounded-full px-2.5 py-1.5 transition hover:bg-orange/10 hover:text-orange-light sm:px-3">
            Weather
          </Link>
          <Link to="/weather/details" className="rounded-full px-2.5 py-1.5 transition hover:bg-emerald/10 hover:text-emerald-light sm:px-3">
            Saved
          </Link>
        </div>
      </nav>
    </div>
  );
}