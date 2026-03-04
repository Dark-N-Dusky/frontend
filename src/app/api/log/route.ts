import { NextRequest, NextResponse } from 'next/server';
import { writeFrontendLog } from '@/lib/serverLogger';
import type { FrontendLogEntry } from '@/lib/serverLogger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedLevels: FrontendLogEntry['level'][] = ['verbose', 'warn', 'error'];

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<FrontendLogEntry>;

    const level = allowedLevels.includes(payload.level ?? 'verbose')
      ? (payload.level ?? 'verbose')
      : 'verbose';
    const message =
      typeof payload.message === 'string' ? payload.message : 'Frontend request';
    const metadata =
      payload.metadata && typeof payload.metadata === 'object'
        ? payload.metadata
        : {};

    await writeFrontendLog({
      level,
      message,
      metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    await writeFrontendLog({
      level: 'error',
      message: 'Failed to process frontend log payload',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
