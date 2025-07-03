'use client';

import InstructionsPanel from "./components/InstructionsPanel";
import Screen from "./components/Screen";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Screen />
      </div>
      <InstructionsPanel />
    </div>
  );
}
