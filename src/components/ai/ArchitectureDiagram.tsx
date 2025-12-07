import React, { useState } from 'react';
import RoundTableSection from './diagram/RoundTableSection';
import AIAgentSection from './diagram/AIAgentSection';
import OrganisationSection from './diagram/OrganisationSection';
import LebenSection from './diagram/LebenSection';
import AvatarSection from './diagram/AvatarSection';

interface DiagramProps {
  onSectionClick?: (section: string) => void;
  highlightSection?: string | null;
}

const ArchitectureDiagram: React.FC<DiagramProps> = ({ onSectionClick, highlightSection }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const activeSection = highlightSection || hoveredSection;

  const handleClick = (section: string) => {
    onSectionClick?.(section);
  };

  return (
    <svg viewBox="0 0 800 900" className="w-full h-auto" style={{ maxWidth: '800px' }}>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="roundTableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="aiAgentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="orgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="lifeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="highlightGlow"><feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="800" height="900" fill="url(#bgGrad)" rx="20" />
      <text x="400" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
        Mio-Lifepilot Architektur
      </text>

      <RoundTableSection hover={activeSection === 'roundtable'} 
        onHover={() => setHoveredSection('roundtable')} 
        onLeave={() => setHoveredSection(null)}
        onClick={() => handleClick('roundtable')} />

      <line x1="400" y1="180" x2="400" y2="240" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="5,5" />
      <polygon points="400,250 395,240 405,240" fill="#8b5cf6" />

      <AIAgentSection hover={activeSection === 'aiagent'}
        onHover={() => setHoveredSection('aiagent')}
        onLeave={() => setHoveredSection(null)}
        onClick={() => handleClick('aiagent')} />

      <line x1="300" y1="340" x2="200" y2="400" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="500" y1="340" x2="600" y2="400" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />

      <OrganisationSection hover={activeSection === 'organisation'}
        onHover={() => setHoveredSection('organisation')}
        onLeave={() => setHoveredSection(null)}
        onClick={() => handleClick('organisation')} />

      <LebenSection hover={activeSection === 'leben'}
        onHover={() => setHoveredSection('leben')}
        onLeave={() => setHoveredSection(null)}
        onClick={() => handleClick('leben')} />

      <line x1="200" y1="720" x2="400" y2="780" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="600" y1="720" x2="400" y2="780" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />

      <AvatarSection hover={activeSection === 'avatar'}
        onHover={() => setHoveredSection('avatar')}
        onLeave={() => setHoveredSection(null)}
        onClick={() => handleClick('avatar')} />
    </svg>
  );
};

export default ArchitectureDiagram;
