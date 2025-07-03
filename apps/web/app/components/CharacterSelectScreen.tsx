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

    // Ensure Toad and Toadette are always unlocked
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

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-black px-4 py-6 overflow-y-auto bg-white">
            <h1 className="text-2xl mb-6 font-bold">Select Characters</h1>

            <div className="grid grid-cols-8 gap-4">
                {ALL_CHARACTERS.map(char => {
                    const isLocked = !unlockedCharacters.includes(char);
                    const isSelected = selected.p1 === char || selected.p2 === char;

                    return (
                        <div
                            key={char}
                            className={`relative cursor-pointer border-2 p-1 rounded-lg transition w-16 h-16 bg-white ${isSelected ? 'border-yellow-500' : 'border-black/20'
                                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleClick(char)}
                        >
                            {/* Character sprite */}
                            <img
                                src={`/characters/${char}`}
                                alt={char}
                                className="w-full h-full object-contain rounded z-0"
                            />

                            {/* Locked overlay */}
                            {isLocked && (
                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-xs font-bold z-10">
                                    LOCKED
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6">
                {selected.p1 && selected.p2 && (
                    <button
                        onClick={handleNext}
                        className="mt-4 px-6 py-2 border border-black rounded uppercase tracking-widest bg-white hover:bg-black hover:text-white transition"
                    >
                        Next
                    </button>
                )}
            </div>

            <div className="mt-4 text-sm text-center">
                {selected.p1 && <div>Player 1: {selected.p1.replace('.png', '').replaceAll('-', ' ')}</div>}
                {selected.p2 && <div>{mode === 'multi' ? 'Player 2' : 'CPU'}: {selected.p2.replace('.png', '').replaceAll('-', ' ')}</div>}
            </div>
        </div>
    );
}
