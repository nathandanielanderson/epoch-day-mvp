export const revalidate = 15; // cache a tad to be polite
export async function GET() {
    const res = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getEpochInfo" }),
        // Next.js caching hint too
        next: { revalidate: 90 },
    });
    if (!res.ok) return Response.json({ error: "rpc" }, { status: 502 });
    const data = await res.json();
    return Response.json({ epoch: data?.result?.epoch ?? null });
}