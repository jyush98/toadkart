// app/components/Screen.tsx
'use client';

import { useState } from 'react';
import Game from './Game';

export default function Screen() {
  const [view, setView] = useState<'menu' | 'game'>('menu');
  const [mode, setMode] = useState<'single' | 'multi' | null>(null);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="relative w-[90vw] h-[50vh] border-2 border-white rounded-md overflow-hidden font-mono text-white">
        {view === 'menu' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl mb-8">ToadKart</h1>
            <div className="flex gap-8">
              <button
                className="w-48 h-24 border-2 border-white bg-[#222] hover:bg-[#333] transition"
                onClick={() => {
                  setMode('single');
                  setView('game');
                }}
              >
                SINGLE PLAYER
              </button>
              <button
                className="w-48 h-24 border-2 border-white bg-[#222] hover:bg-[#333] transition"
                onClick={() => {
                  setMode('multi');
                  setView('game');
                }}
              >
                TWO PLAYERS
              </button>
            </div>
          </div>
        ) : (
          mode && <Game mode={mode} />
        )}
      </div>
    </div>
  );
}
