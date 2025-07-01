'use client';

interface PlayerProps {
  y: number;
  xPercent: number; // e.g. 25 = left 25%
  sprite: string;
}

export default function Player({ y, xPercent, sprite }: PlayerProps) {
  return (
    <img
      src={sprite}
      alt="ToadKart character"
      className="absolute z-50"
      style={{
        top: `calc(50% + ${y}px)`,
        left: `${xPercent}%`,
        width: '48px',
        height: '48px',
        transform: 'translateY(-50%)',
        transition: 'top 0.1s ease-out',
        objectFit: 'contain',
      }}
    />
  );
}
