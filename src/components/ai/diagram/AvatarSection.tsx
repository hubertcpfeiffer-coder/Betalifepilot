import React from 'react';

interface Props {
  hover: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const AvatarSection: React.FC<Props> = ({ hover, onHover, onLeave, onClick }) => {
  return (
    <g 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      filter={hover ? 'url(#glow)' : undefined}
    >
      {/* Main Container */}
      <rect x="300" y="770" width="200" height="110" rx="15" 
        fill="rgba(249, 115, 22, 0.1)" 
        stroke="url(#avatarGrad)" 
        strokeWidth={hover ? "3" : "2"} />
      
      {/* Avatar Circle */}
      <circle cx="400" cy="815" r="25" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" strokeWidth="2" />
      
      {/* User SVG Icon */}
      <g transform="translate(385, 800)">
        <circle cx="15" cy="8" r="6" fill="#f97316" />
        <path d="M15 16c-5 0-9 2-9 4v2h18v-2c0-2-4-4-9-4z" fill="#f97316" />
      </g>
      
      {/* Title */}
      <text x="400" y="860" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        PERSÖNLICHER AVATAR
      </text>
      
      {/* Subtitle */}
      <text x="400" y="875" textAnchor="middle" fill="#f97316" fontSize="10">
        Dein digitaler Begleiter
      </text>
    </g>
  );
};

export default AvatarSection;
