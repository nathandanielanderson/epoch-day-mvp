'use client';
import { useEffect, useState } from 'react';

type EpochRes = { epoch: number | null };

function errMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

export default function EpochDisplay() {
  const [epoch, setEpoch] = useState<number | null>(null);
  const [at, setAt] = useState<Date | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const r = await fetch('/api/epoch', { cache: 'no-store' });
      const j: EpochRes = await r.json();
      if (!r.ok || j.epoch == null) throw new Error('unavailable');
      setEpoch(j.epoch);
      setAt(new Date());
      setErr(null);
    } catch (e: unknown) {
      setErr(errMessage(e));
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
      <div className="text-7xl sm:text-8xl md:text-[8rem] font-semibold tracking-tight leading-none">
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
