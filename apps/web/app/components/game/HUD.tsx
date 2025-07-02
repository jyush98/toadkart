'use client';

interface HUDProps {
  coins: number;
  elapsed: number;
}

export default function HUD({ coins, elapsed }: HUDProps) {
  return (
    <>
      <div className="absolute top-2 left-4 text-white text-sm font-mono z-30">
        🪙 {coins}
      </div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-mono z-30">
        ⏱ {elapsed}s
      </div>
    </>
  );
}
