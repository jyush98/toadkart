// apps/web/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getBackendStatus } from '@/utils/api';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getBackendStatus().then((data) => {
      setMessage(data.message);
    });
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">ToadKart Frontend</h1>
      <p>Backend says: {message}</p>
    </main>
  );
}
