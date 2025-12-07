import React, { useEffect, useState } from 'react';

interface Props {
  position: { x: number; y: number };
  isSpeaking: boolean;
  isWalking: boolean;
  facingRight: boolean;
}

const WalkingAvatar: React.FC<Props> = ({ position, isSpeaking, isWalking, facingRight }) => {
  const avatarUrl = 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764952694987_505e10f8.jpg';
  const [bobY, setBobY] = useState(0);
  const [legAngle, setLegAngle] = useState(0);
  const [armAngle, setArmAngle] = useState(0);

  useEffect(() => {
    let frame: number;
    let time = 0;
    const animate = () => {
      time += isWalking ? 0.2 : 0.04;
      setBobY(Math.sin(time * (isWalking ? 6 : 1.5)) * (isWalking ? 8 : 3));
      if (isWalking) {
        setLegAngle(Math.sin(time * 10) * 30);
        setArmAngle(Math.sin(time * 10 + Math.PI) * 20);
      } else {
        setLegAngle(0);
        setArmAngle(0);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isWalking]);

  return (
    <div className="fixed z-[100] pointer-events-none"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`, 
        transform: `translate(-50%, -50%)`,
        transition: isWalking ? 'left 1.8s ease-in-out, top 1.8s ease-in-out' : 'none'
      }}>
      <div className={`relative ${facingRight ? '' : 'scale-x-[-1]'}`} 
        style={{ transform: `${facingRight ? '' : 'scaleX(-1)'} translateY(${bobY}px)` }}>
        
        {/* Ambient glow */}
        <div className={`absolute -inset-12 rounded-full blur-3xl transition-all duration-700 ${
          isSpeaking ? 'bg-gradient-to-r from-cyan-400/50 to-blue-500/50 scale-150' : 'bg-blue-500/20 scale-100'
        }`} />
        
        {/* Ground shadow */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-8 bg-black/30 rounded-full blur-lg"
          style={{ transform: `translateX(-50%) scaleX(${isWalking ? 0.6 : 0.9})` }} />
        
        {/* Body (simple stick figure legs when walking) */}
        {isWalking && (
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="w-3 h-14 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full origin-top shadow-lg" 
              style={{ transform: `rotate(${legAngle}deg)` }} />
            <div className="w-3 h-14 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full origin-top shadow-lg" 
              style={{ transform: `rotate(${-legAngle}deg)` }} />
          </div>
        )}
        
        {/* Arms when walking */}
        {isWalking && (
          <>
            <div className="absolute top-16 -left-4 w-3 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full origin-top shadow-lg"
              style={{ transform: `rotate(${armAngle}deg)` }} />
            <div className="absolute top-16 -right-4 w-3 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full origin-top shadow-lg"
              style={{ transform: `rotate(${-armAngle}deg)` }} />
          </>
        )}

        {/* Main Avatar with 3D effect */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <div className={`relative w-36 h-36 rounded-full overflow-hidden shadow-2xl transition-all duration-500`}
            style={{ 
              border: `5px solid ${isSpeaking ? '#22d3ee' : '#3b82f6'}`,
              boxShadow: isSpeaking 
                ? '0 0 80px rgba(34,211,238,0.6), 0 0 120px rgba(34,211,238,0.3), inset 0 0 40px rgba(34,211,238,0.2)' 
                : '0 0 40px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.2)',
              transform: `rotateY(${facingRight ? 8 : -8}deg) rotateX(${isWalking ? -5 : 0}deg)`
            }}>
            <img src={avatarUrl} alt="Mio" className="w-full h-full object-cover" />
            
            {/* Speaking overlay */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/30 to-transparent animate-pulse" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="w-1.5 bg-white rounded-full animate-bounce shadow-lg" 
                      style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 0.05}s`, animationDuration: '0.35s' }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 3D ring effects */}
          <div className={`absolute inset-[-10px] rounded-full border-2 transition-all duration-500 ${isSpeaking ? 'border-cyan-400/70 animate-ping' : 'border-blue-400/30'}`} />
          <div className={`absolute inset-[-20px] rounded-full border transition-all duration-500 ${isSpeaking ? 'border-cyan-300/50' : 'border-blue-300/20'}`} />
          <div className={`absolute inset-[-30px] rounded-full border transition-all duration-500 ${isSpeaking ? 'border-cyan-200/30' : 'border-transparent'}`} />
        </div>

        {/* Speech/microphone indicator */}
        {isSpeaking && (
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        )}
        
        {/* Walking indicator */}
        {isWalking && (
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkingAvatar;
