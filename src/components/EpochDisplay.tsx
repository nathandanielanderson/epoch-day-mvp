'use client';
import { useEffect, useState } from 'react';
export default function EpochDisplay() {
  const [epoch, setEpoch] = useState<number | null>(null);
  const [at, setAt] = useState<Date | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const r = await fetch('/api/epoch', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok || j.epoch == null) throw new Error('unavailable');
      setEpoch(j.epoch);
      setAt(new Date());
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? 'error');
    }
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <div className="text-sm text-zinc-400">Current Solana Epoch</div>
      <div className="text-6xl font-semibold tracking-tight">
        {epoch ?? '—'}
      </div>
      <div className="mt-2 text-xs text-zinc-500">
        {err
          ? `Error: ${err}`
          : at
          ? `Updated ${at.toLocaleString()}`
          : 'Loading…'}
      </div>
    </div>
  );
}
