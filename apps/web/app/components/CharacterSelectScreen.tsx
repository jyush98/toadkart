'use client';

import { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';

interface Props {
  mode: 'single' | 'multi';
  onSelect: (p1: string, p2: string) => void;
}

const ALL_CHARACTERS = [
  'toad.png',
  'toadette.png',
  'mario.png',
  'luigi.png',
  'peach.png',
  'daisy.png',
  'yoshi.png',
  'wario.png',
  'donkey-kong-jr.png',
  'bowser.png',
  'donkey-kong.png',
  'dry-bowser.png',
  'hammer-bro.png',
  'koopa-troopa.png',
  'metal-mario.png',
  'waluigi.png',
];

export default function CharacterSelectScreen({ mode, onSelect }: Props) {
  const { unlocked } = useCharacterStore();
  const [selected, setSelected] = useState<{ p1: string | null; p2: string | null }>({
    p1: null,
    p2: null,
  });

  const unlockedCharacters = Array.from(new Set(['toad.png', 'toadette.png', ...(unlocked ?? [])]));

  const handleClick = (char: string) => {
    if (!unlockedCharacters.includes(char)) return;

    if (!selected.p1) {
      setSelected({ ...selected, p1: char });
    } else if (!selected.p2 && char !== selected.p1) {
      setSelected({ ...selected, p2: char });
    }
  };

  const handleNext = () => {
    if (selected.p1 && selected.p2) {
      onSelect(selected.p1, selected.p2);
    }
  };

  const canProceed = selected.p1 && selected.p2;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-black px-6 py-8 overflow-y-auto bg-white font-mono space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Select Characters</h1>
        <p className="text-sm text-gray-600">Click to select your character(s)</p>
      </div>

      {/* Selections + Grid */}
      <div className="flex w-full justify-between items-start gap-8">
        {/* Player 1 Selection */}
        <div className="flex flex-col items-center w-32">
          {selected.p1 ? (
            <>
              <img
                src={`/characters/${selected.p1}`}
                alt="Player 1"
                className="w-20 h-20 object-contain rounded"
              />
              <span className="text-xs mt-2 font-semibold text-gray-700 text-center">
                Player 1:<br />
                {selected.p1.replace('.png', '').replaceAll('-', ' ')}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400 text-center">Waiting for P1...</span>
          )}
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-8 gap-4">
          {ALL_CHARACTERS.map(char => {
            const isLocked = !unlockedCharacters.includes(char);
            const isSelected = selected.p1 === char || selected.p2 === char;

            return (
              <div
                key={char}
                className={`relative cursor-pointer border-2 p-1 rounded-lg transition w-16 h-16 bg-white
                  ${isSelected ? 'border-yellow-500' : 'border-black/20'}
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleClick(char)}
              >
                <img
                  src={`/characters/${char}`}
                  alt={char}
                  className="w-full h-full object-contain rounded z-0"
                />

                {isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-xs font-bold z-10">
                    LOCKED
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Player 2 Selection */}
        <div className="flex flex-col items-center w-32">
          {selected.p2 ? (
            <>
              <img
                src={`/characters/${selected.p2}`}
                alt="Player 2"
                className="w-20 h-20 object-contain rounded transform scale-x-[-1]"
              />
              <span className="text-xs mt-2 font-semibold text-gray-700 text-center">
                {mode === 'multi' ? 'Player 2' : 'CPU'}:<br />
                {selected.p2.replace('.png', '').replaceAll('-', ' ')}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400 text-center">
              Waiting for {mode === 'multi' ? 'P2' : 'CPU'}...
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex flex-col items-center space-y-2">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-48 h-12 border-2 text-lg uppercase tracking-widest rounded transition
            ${canProceed
              ? 'bg-black text-white hover:bg-white hover:text-black border-black'
              : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
            }`}
        >
          Play
        </button>

        {(selected.p1 || selected.p2) && (
          <button
            onClick={() => setSelected({ p1: null, p2: null })}
            className="text-sm text-gray-700 underline hover:text-black transition"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}
