'use client';

interface GameOverScreenProps {
  time: number;
  coins: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function GameOverScreen({ time, coins, onPlayAgain, onMainMenu }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white font-mono z-50">
      <h2 className="text-3xl mb-4">🏁 Finished!</h2>
      <p className="mb-2">⏱ Time: {time}s</p>
      <p className="mb-6">🪙 Coins: {coins}</p>
      <div className="flex gap-4">
        <button
          className="px-6 py-2 border border-white hover:bg-white hover:text-black transition"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
        <button
          className="px-6 py-2 border border-white hover:bg-white hover:text-black transition"
          onClick={onMainMenu}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
