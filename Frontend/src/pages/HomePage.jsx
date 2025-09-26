import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="bg-[#000000] font-body text-slate-300 flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-center items-center min-h-[20vh]">
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/">Home</Link>
          </a>
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/about">About</Link>
          </a>
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/reports">Reports</Link>
          </a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 tracking-wider [text-shadow:0_0_8px_rgba(129,140,248,0.6),0_0_20px_rgba(56,189,248,0.4),0_0_30px_rgba(167,139,250,0.3)]">
            Track Back
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 font-light max-w-md mx-auto">
            Report the missing product and get the info if someone found it.
          </p>
          <a
            href="#"
            className="inline-block px-10 py-4 rounded-lg bg-teal-500/20 text-white text-lg font-bold leading-normal tracking-wide shadow-lg hover:bg-teal-400/30 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300 border border-teal-500/50 [box-shadow:0_0_5px_#38bdf8,0_0_10px_#38bdf8,0_0_15px_#818cf8,0_0_20px_#818cf8]"
          >
            <Link to="/auth">Get Started</Link>
          </a>
        </div>
      </main>

      <footer className="w-full text-center p-6">
        <p className="text-sm text-slate-500">
          © 2025 Track Back. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
