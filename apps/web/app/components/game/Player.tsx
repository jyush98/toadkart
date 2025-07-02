'use client';

interface PlayerProps {
  xPercent: number; // typically 25
  y: number;        // pixel offset relative to center
  sprite: string;   // image path
}

export default function Player({ xPercent, y, sprite }: PlayerProps) {
  return (
    <img
      src={sprite}
      alt="Player"
      className="absolute"
      style={{
        left: `${xPercent}%`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: '48px',
        height: '48px',
        zIndex: 20,
      }}
    />
  );
}
