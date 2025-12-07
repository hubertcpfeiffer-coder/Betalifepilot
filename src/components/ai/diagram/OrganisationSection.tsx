import React from 'react';

interface Props {
  hover: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const OrganisationSection: React.FC<Props> = ({ hover, onHover, onLeave, onClick }) => {
  const items = [
    { name: 'Email', color: '#06b6d4', desc: 'Postfach verwalten' },
    { name: 'Kalender', color: '#3b82f6', desc: 'Termine planen' },
    { name: 'Kontakte', color: '#6366f1', desc: 'Adressbuch' },
    { name: 'Finanzen', color: '#8b5cf6', desc: 'Budget & Banking' },
    { name: 'Social Media', color: '#ec4899', desc: 'Netzwerke' },
    { name: 'Einkaufen', color: '#f43f5e', desc: 'Shopping Listen' },
    { name: 'Einstellungen', color: '#64748b', desc: 'Konfiguration' },
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
      <rect x="40" y="400" width="280" height="320" rx="15" 
        fill="rgba(59, 130, 246, 0.1)" 
        stroke="url(#orgGrad)" 
        strokeWidth={hover ? "3" : "2"} />
      
      {/* Header */}
      <rect x="40" y="400" width="280" height="40" rx="15" 
        fill="rgba(59, 130, 246, 0.3)" />
      <text x="180" y="427" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        ORGANISATION
      </text>
      
      {/* Items with SVG icons */}
      {items.map((item, i) => (
        <g key={i}>
          <rect x="55" y={450 + i * 38} width="250" height="32" rx="8" 
            fill="rgba(59, 130, 246, 0.15)" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="1" />
          <circle cx="75" cy={466 + i * 38} r="10" fill={item.color} />
          <text x="95" y={471 + i * 38} fill="white" fontSize="13" fontWeight="500">
            {item.name}
          </text>
          <text x="290" y={471 + i * 38} textAnchor="end" fill="#94a3b8" fontSize="10">
            {item.desc}
          </text>
        </g>
      ))}
    </g>
  );
};

export default OrganisationSection;
