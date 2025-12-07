import React, { useState, forwardRef } from 'react';
import { Bot, Users, User, Briefcase, Heart, Download } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';

interface Props {
  onOpenAIAgent: () => void;
  highlightSection?: string | null;
}

const ArchitectureSection = forwardRef<HTMLDivElement, Props>(({ onOpenAIAgent, highlightSection }, ref) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const activeSection = highlightSection || selectedSection;

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    if (section === 'aiagent') onOpenAIAgent();
  };

  const handleDownloadSVG = () => {
    const svg = document.querySelector('.architecture-diagram svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mio-lifepilot-architektur.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section ref={ref} id="features" className="py-16 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mio-Lifepilot <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Architektur</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Klicke auf die Bereiche um mehr zu erfahren. Das SVG-Diagramm kannst du herunterladen und bearbeiten.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="architecture-diagram relative">
            <ArchitectureDiagram onSectionClick={handleSectionClick} highlightSection={activeSection} />
            <button onClick={handleDownloadSVG}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" /> SVG herunterladen
            </button>
          </div>

          <div className="space-y-4">
            <FeatureCard icon={<Users />} title="Runder Tisch der KIs" desc="5 KI-Persönlichkeiten: Logic, Kreativ, Empathie, Sicherheit, Effizienz" color="from-cyan-500 to-blue-500" active={activeSection === 'roundtable'} />
            <FeatureCard icon={<Bot />} title="Mio (AI Agent)" desc="Dein zentraler KI-Avatar der alle Online-Aufgaben für dich erledigt" color="from-blue-500 to-indigo-500" active={activeSection === 'aiagent'} />
            <FeatureCard icon={<Briefcase />} title="Organisation" desc="Email, Kalender, Kontakte, Finanzen, Social Media, Einkaufen, Einstellungen" color="from-indigo-500 to-purple-500" active={activeSection === 'organisation'} />
            <FeatureCard icon={<Heart />} title="Leben" desc="Erfolgscoach, Gesundheitscoach, Private Professor - Dein Wissenscoach" color="from-emerald-500 to-teal-500" active={activeSection === 'leben'} />
            <FeatureCard icon={<User />} title="Persönlicher Avatar" desc="Dein digitaler Begleiter mit Sprach- und Gesichtserkennung" color="from-amber-500 to-orange-500" active={activeSection === 'avatar'} />
          </div>
        </div>
      </div>
    </section>
  );
});

const FeatureCard: React.FC<{icon: React.ReactNode; title: string; desc: string; color: string; active?: boolean}> = ({icon, title, desc, color, active}) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${active ? 'bg-white/15 border-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 ${active ? 'animate-pulse' : ''}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  </div>
);

ArchitectureSection.displayName = 'ArchitectureSection';

export default ArchitectureSection;
