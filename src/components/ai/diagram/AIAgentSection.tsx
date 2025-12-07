import React from 'react';

interface Props {
  hover: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const AIAgentSection: React.FC<Props> = ({ hover, onHover, onLeave, onClick }) => {
  return (
    <g 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      filter={hover ? 'url(#glow)' : undefined}
    >
      {/* Hexagon Shape for Mio */}
      <polygon 
        points="400,250 460,280 460,340 400,370 340,340 340,280" 
        fill="rgba(168, 85, 247, 0.2)" 
        stroke="url(#aiAgentGrad)" 
        strokeWidth={hover ? "3" : "2"} 
      />
      
      {/* Inner Circle */}
      <circle cx="400" cy="310" r="35" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" strokeWidth="2" />
      
      {/* Mio Icon - Robot SVG */}
      <g transform="translate(385, 290)">
        <rect x="3" y="0" width="24" height="20" rx="3" fill="#ec4899" />
        <circle cx="10" cy="10" r="3" fill="white" />
        <circle cx="20" cy="10" r="3" fill="white" />
        <rect x="12" y="14" width="6" height="2" rx="1" fill="white" />
        <rect x="8" y="-4" width="2" height="4" fill="#ec4899" />
        <rect x="20" y="-4" width="2" height="4" fill="#ec4899" />
      </g>
      
      {/* Title */}
      <text x="400" y="340" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        MIO
      </text>
      
      {/* Subtitle */}
      <text x="400" y="390" textAnchor="middle" fill="#a855f7" fontSize="11">
        Dein KI-Lifepilot
      </text>
    </g>
  );
};

export default AIAgentSection;
