'use client';

export default function Track() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url('/tracks/track1.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center`,
        backgroundSize: 'auto 100%',
        zIndex: 0,
      }}
    />
  );
}
