import React from 'react';
import { Sparkles, ArrowRight, Target, Brain, Heart, UserPlus, Play, Camera, Rocket } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onOpenAIAgent?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection: React.FC<Props> = ({ onGetStarted, onOpenAIAgent }) => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764941153164_0f52a2d7.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium mb-6 border border-indigo-200">
            <Rocket className="w-4 h-4" />
            Beta-Tester gesucht - Jetzt kostenlos starten!
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Mio-Lifepilot</span>
            <br />Dein persönlicher KI-Avatar
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Erstelle deinen eigenen KI-Assistenten, der <strong>aussieht und spricht wie du</strong>. 
            Mio übernimmt alle deine Online-Aufgaben - von E-Mails über Finanzen bis zur persönlichen Entwicklung.
          </p>
          
          {/* Avatar Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Dein Avatar wartet auf dich!</p>
                  <p className="text-sm text-gray-500">Mache ein paar Fotos und starte sofort</p>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 group">
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Kostenlos registrieren & Avatar erstellen
            </button>
            <button onClick={onOpenAIAgent} className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border-2 border-indigo-200 hover:border-indigo-400 flex items-center justify-center gap-2 group shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 animate-pulse" />
              <Play className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">Interaktive Tour starten</span>
              <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Persönlicher Avatar</h3>
              <p className="text-sm text-gray-500">Sieht aus und spricht wie du</p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Intelligente Automatisierung</h3>
              <p className="text-sm text-gray-500">Alle Online-Aufgaben automatisch erledigt</p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Persönliche Coaches</h3>
              <p className="text-sm text-gray-500">Erfolg, Gesundheit & Wissen</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-8 mt-12">
          <div className="text-center"><div className="text-3xl font-bold text-indigo-600">24/7</div><div className="text-sm text-gray-500">Verfügbar</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-purple-600">100%</div><div className="text-sm text-gray-500">Personalisiert</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-pink-600">5 KIs</div><div className="text-sm text-gray-500">Am Runden Tisch</div></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
