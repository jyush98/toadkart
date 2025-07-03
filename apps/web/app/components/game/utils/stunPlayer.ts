export function stunPlayer(setStunned: (b: boolean) => void) {
    setStunned(true);
    setTimeout(() => setStunned(false), 1000);
  }
  