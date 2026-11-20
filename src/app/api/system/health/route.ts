import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/server/bff/config";

// GET /api/system/health → {backend}/health и /ready (публичные служебные endpoint-ы).
// Для экрана системного администратора: реальный статус и задержка API.
const BASE = BACKEND_URL.replace(/\/api\/v1\/?$/, "");

const probe = async (path: string) => {
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    return { ok: res.ok, status: res.status, latencyMs: Date.now() - started };
  } catch {
    return { ok: false, status: 0, latencyMs: null };
  }
};

export async function GET() {
  const [health, ready] = await Promise.all([probe("/health"), probe("/ready")]);
  return NextResponse.json({ health, ready, checkedAt: new Date().toISOString() });
}
