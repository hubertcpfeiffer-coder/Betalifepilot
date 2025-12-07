import React from 'react';

interface Props {
  hover: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const LebenSection: React.FC<Props> = ({ hover, onHover, onLeave, onClick }) => {
  const coaches = [
    { 
      name: 'Erfolgscoach', 
      color: '#f59e0b',
      desc: 'Entwickelt mit dir deine Ziele und deren Umsetzung'
    },
    { 
      name: 'Gesundheitscoach', 
      color: '#10b981',
      desc: 'Fitness, Ernährung & mentale Gesundheit'
    },
    { 
      name: 'Private Professor', 
      color: '#8b5cf6',
      desc: 'Dein persönlicher Wissenscoach'
    },
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
      <rect x="480" y="400" width="280" height="320" rx="15" 
        fill="rgba(16, 185, 129, 0.1)" 
        stroke="url(#lifeGrad)" 
        strokeWidth={hover ? "3" : "2"} />
      
      {/* Header */}
      <rect x="480" y="400" width="280" height="40" rx="15" 
        fill="rgba(16, 185, 129, 0.3)" />
      <text x="620" y="427" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        LEBEN
      </text>
      
      {/* Coaches */}
      {coaches.map((coach, i) => (
        <g key={i}>
          <rect x="495" y={455 + i * 85} width="250" height="75" rx="10" 
            fill="rgba(16, 185, 129, 0.15)" 
            stroke={coach.color}
            strokeWidth="2" />
          
          {/* Icon Circle with SVG icon */}
          <circle cx="525" cy={480 + i * 85} r="18" fill={coach.color} opacity="0.9" />
          {i === 0 && (
            <g transform={`translate(513, 468)`}>
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
          {i === 1 && (
            <g transform={`translate(513, 468)`}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" transform="scale(0.8)" />
            </g>
          )}
          {i === 2 && (
            <g transform={`translate(513, 468)`}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="white" transform="scale(0.9)" />
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" transform="scale(0.9)" />
            </g>
          )}
          
          {/* Name */}
          <text x="555" y={478 + i * 85} fill="white" fontSize="13" fontWeight="bold">
            {coach.name}
          </text>
          
          {/* Description */}
          <text x="555" y={498 + i * 85} fill="#94a3b8" fontSize="9">
            {coach.desc.length > 35 ? coach.desc.substring(0, 35) + '...' : coach.desc}
          </text>
          <text x="555" y={515 + i * 85} fill="#94a3b8" fontSize="9">
            {coach.desc.length > 35 ? coach.desc.substring(35) : ''}
          </text>
        </g>
      ))}
    </g>
  );
};

export default LebenSection;
