import React, { useEffect, useState } from 'react';

interface Props {
  isSpeaking: boolean;
  isPointing: boolean;
  pointDirection?: 'left' | 'right' | 'up' | 'down';
  emotion?: 'happy' | 'thinking' | 'excited';
}

const Avatar3D: React.FC<Props> = ({ isSpeaking, isPointing, pointDirection = 'right', emotion = 'happy' }) => {
  const avatarUrl = 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764952694987_505e10f8.jpg';
  const [rotateY, setRotateY] = useState(0);
  const [bobY, setBobY] = useState(0);
  
  // Idle animation - gentle floating and rotation
  useEffect(() => {
    let frame: number;
    let time = 0;
    const animate = () => {
      time += 0.02;
      setBobY(Math.sin(time * 2) * 3);
      if (!isPointing) setRotateY(Math.sin(time) * 5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isPointing]);

  const getPointRotation = () => {
    switch (pointDirection) {
      case 'left': return `rotateY(${-25 + rotateY}deg) rotateZ(8deg)`;
      case 'right': return `rotateY(${25 + rotateY}deg) rotateZ(-8deg)`;
      case 'up': return `rotateX(-20deg) rotateY(${rotateY}deg)`;
      case 'down': return `rotateX(20deg) rotateY(${rotateY}deg)`;
      default: return `rotateY(${rotateY}deg)`;
    }
  };

  return (
    <div className="relative" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
      {/* 3D Container with floating animation */}
      <div 
        className={`relative transition-transform duration-500 ease-out`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `${isPointing ? getPointRotation() : `rotateY(${rotateY}deg)`} translateY(${bobY}px) ${isPointing ? 'scale(1.1)' : 'scale(1)'}`,
        }}
      >
        {/* Deep Glow Effect */}
        <div className={`absolute inset-[-20px] rounded-full blur-2xl transition-all duration-500 ${
          isSpeaking ? 'bg-gradient-to-r from-cyan-400/70 to-blue-500/70 scale-130' : 'bg-gradient-to-r from-blue-400/40 to-purple-400/40 scale-115'
        }`} style={{ transform: 'translateZ(-30px)' }} />
        
        {/* Outer Rings - 3D depth */}
        <div className={`absolute inset-[-12px] rounded-full border-2 transition-all duration-300 ${isSpeaking ? 'border-cyan-400/60 animate-ping' : 'border-blue-400/30'}`} 
          style={{ transform: 'translateZ(-20px)' }} />
        <div className={`absolute inset-[-24px] rounded-full border transition-all duration-300 ${isSpeaking ? 'border-blue-400/40 animate-pulse' : 'border-purple-400/20'}`}
          style={{ transform: 'translateZ(-40px)' }} />
        
        {/* Main Avatar Container */}
        <div className={`relative w-32 h-32 rounded-full overflow-hidden shadow-2xl transition-all duration-300 ${
          isSpeaking ? 'shadow-cyan-400/60' : 'shadow-blue-500/40'
        }`} style={{ 
          border: `4px solid ${isSpeaking ? '#22d3ee' : '#3b82f6'}`,
          boxShadow: isSpeaking ? '0 0 40px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.2)' : '0 0 30px rgba(59, 130, 246, 0.4)',
        }}>
          <img src={avatarUrl} alt="Mio Avatar" className="w-full h-full object-cover" />
          
          {/* Speaking Animation Overlay */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent animate-pulse" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="w-1.5 bg-white/90 rounded-full" 
                    style={{ 
                      height: `${6 + Math.sin(Date.now() / 100 + i) * 6}px`, 
                      animation: `bounce 0.3s ease-in-out ${i * 0.05}s infinite alternate`,
                    }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pointing Indicator */}
        {isPointing && (
          <div className={`absolute z-10 transition-all duration-700 ${
            pointDirection === 'right' ? '-right-16 top-1/2 -translate-y-1/2' :
            pointDirection === 'left' ? '-left-16 top-1/2 -translate-y-1/2' :
            pointDirection === 'up' ? 'left-1/2 -top-16 -translate-x-1/2' :
            'left-1/2 -bottom-16 -translate-x-1/2'
          }`}>
            <div className={`relative ${
              pointDirection === 'left' ? 'rotate-180' : 
              pointDirection === 'up' ? '-rotate-90' : 
              pointDirection === 'down' ? 'rotate-90' : ''
            }`}>
              <svg className="w-12 h-12 text-cyan-400 animate-pulse drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" transform="rotate(90 12 12)"/>
              </svg>
              <div className="absolute inset-0 blur-md bg-cyan-400/50 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Floating Particles */}
      {isSpeaking && (
        <div className="absolute inset-[-20px] pointer-events-none overflow-visible">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70"
              style={{ 
                left: `${10 + (i * 12)}%`, 
                top: `${15 + (i % 3) * 25}%`, 
                animation: `float ${1.5 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`,
              }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Avatar3D;
