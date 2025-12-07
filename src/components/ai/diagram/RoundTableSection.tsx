import React from 'react';

interface Props {
  hover: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const RoundTableSection: React.FC<Props> = ({ hover, onHover, onLeave, onClick }) => {
  const aiPersonalities = [
    { name: 'Logic', abbr: 'LOG', color: '#3b82f6', x: 280, y: 100 },
    { name: 'Kreativ', abbr: 'KRE', color: '#ec4899', x: 340, y: 70 },
    { name: 'Empathie', abbr: 'EMP', color: '#10b981', x: 400, y: 60 },
    { name: 'Sicherheit', abbr: 'SEC', color: '#f59e0b', x: 460, y: 70 },
    { name: 'Effizienz', abbr: 'EFF', color: '#8b5cf6', x: 520, y: 100 },
  ];

  return (
    <g 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      filter={hover ? 'url(#glow)' : undefined}
    >
      {/* Main Container */}
      <rect x="200" y="55" width="400" height="120" rx="15" 
        fill="rgba(6, 182, 212, 0.1)" 
        stroke="url(#roundTableGrad)" 
        strokeWidth={hover ? "3" : "2"} />
      
      {/* Title */}
      <text x="400" y="85" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">
        RUNDER TISCH DER KIs
      </text>
      
      {/* AI Personalities with SVG icons */}
      {aiPersonalities.map((ai, i) => (
        <g key={i}>
          <circle cx={ai.x} cy={ai.y + 50} r="18" fill={ai.color} opacity="0.9" />
          {/* Brain-like icon for each AI */}
          <g transform={`translate(${ai.x - 8}, ${ai.y + 42})`}>
            <circle cx="8" cy="8" r="6" fill="none" stroke="white" strokeWidth="1.5" />
            <path d="M8 4v8M4 8h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <text x={ai.x} y={ai.y + 75} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
            {ai.abbr}
          </text>
        </g>
      ))}
      
      {/* Central Table */}
      <ellipse cx="400" cy="140" rx="60" ry="20" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" strokeWidth="2" />
    </g>
  );
};

export default RoundTableSection;
