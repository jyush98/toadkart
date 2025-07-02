'use client';

interface TrackProps {
  bgOffset: number;
}

export default function Track({ bgOffset }: TrackProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url('/tracks/track1.png')`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: `${bgOffset}px 0px`,
        backgroundSize: 'auto 100%',
        zIndex: 0,
      }}
    />
  );
}
