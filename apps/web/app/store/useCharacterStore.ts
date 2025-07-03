// app/store/useCharacterStore.ts
import { create } from 'zustand';

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

const DEFAULT_UNLOCKED = ['toad.png', 'toadette.png'];

const loadInitialUnlocked = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_UNLOCKED;

  const saved = localStorage.getItem('unlockedCharacters');
  if (!saved) return DEFAULT_UNLOCKED;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      // Filter out anything that's not a string and remove duplicates
      const safe: string[] = Array.from(
        new Set([
          ...DEFAULT_UNLOCKED,
          ...parsed.filter((c): c is string => typeof c === 'string'),
        ])
      );
      return safe;
    }
  } catch {
    // fallback to default
  }

  return DEFAULT_UNLOCKED;
};

interface CharacterStore {
  unlocked: string[];
  selected: {
    p1: string | null;
    p2: string | null;
  };
  setSelected: (p1: string, p2: string) => void;
  unlockNextCharacter: () => string | null;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  unlocked: loadInitialUnlocked(),
  selected: { p1: null, p2: null },
  setSelected: (p1, p2) => set({ selected: { p1, p2 } }),
  unlockNextCharacter: (): string | null => {
    const current = get().unlocked;
    const remaining = ALL_CHARACTERS.filter((char) => !current.includes(char));

    if (remaining.length === 0) return null;

    const next: string = remaining[0]!; // guaranteed string
    const updated = [...current, next];

    set({ unlocked: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('unlockedCharacters', JSON.stringify(updated));
    }

    return next;
  },
}));
