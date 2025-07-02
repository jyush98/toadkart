'use client';

interface FinishLineProps {
  finishX: number;
  scrollX: number;
}

export default function FinishLine({ finishX, scrollX }: FinishLineProps) {
  const screenX = finishX - scrollX;

  return (
    <img
      src="/objects/finish-banner.jpg"
      alt="Finish Line"
      className="absolute"
      style={{
        left: `${screenX}px`,
        top: '80vh',
        height: '20vh',
        transform: 'rotate(90deg) translateY(-100%)',
        transformOrigin: 'top left',
        zIndex: 10,
      }}
    />
  );
}
