'use client';

import React from 'react';

interface GameOverScreenProps {
  winner: 'p1' | 'p2';
  onReturnToMenu?: () => void;
}

export default function GameOverScreen({ winner, onReturnToMenu }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col items-center justify-center z-50">
      <h1 className="text-4xl font-bold mb-4">🏁 Game Over!</h1>
      <p className="text-2xl mb-8">
        {winner === 'p1' ? 'Player 1 Wins!' : 'Player 2 Wins!'}
      </p>
      <button
        onClick={onReturnToMenu}
        className="px-6 py-3 border border-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
      >
        Return to Menu
      </button>
    </div>
  );
}
