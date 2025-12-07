import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Bot, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="text-center p-8 rounded-2xl border border-gray-200 bg-white shadow-xl max-w-md mx-4">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-gray-600 mb-2">Seite nicht gefunden</p>
        <p className="text-gray-500 mb-8">Mio konnte diese Seite leider nicht finden.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">
            <Home className="w-5 h-5" />
            Zur Startseite
          </a>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
