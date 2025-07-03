'use client';

import React from 'react';

interface GameOverScreenProps {
  winner: 'p1' | 'p2';
  onReturnToMenu?: () => void;
  onRestart?: () => void;
}

export default function GameOverScreen({
  winner,
  onReturnToMenu,
  onRestart,
}: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col items-center justify-center z-50 font-mono px-8">
      <h1 className="text-5xl font-bold mb-4 tracking-wide text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.75)] animate-pulse">Game Over</h1>
      <p className="text-3xl mb-12">
        {winner === 'p1' ? 'Player 1 Wins!' : 'Player 2 Wins!'}
      </p>

      <div className="flex gap-8">
        <button
          onClick={onRestart}
          className="w-48 h-16 border-2 border-white bg-[#111] hover:bg-white hover:text-black transition-all duration-200 text-lg rounded-md"
        >
          Play Again
        </button>

        <button
          onClick={onReturnToMenu}
          className="w-48 h-16 border-2 border-white bg-[#111] hover:bg-white hover:text-black transition-all duration-200 text-lg rounded-md"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
}
