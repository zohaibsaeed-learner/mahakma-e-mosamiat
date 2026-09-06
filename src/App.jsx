import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { CustomCursor } from "./components/common/CustomCursor";

import { Dashboard } from "./components/pages/Dashboard";
import { Weather } from "./components/pages/Weather";
import { Details } from "./components/pages/Details";

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <div className="flex min-h-screen flex-col bg-night">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/weather/details" element={<Details />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;