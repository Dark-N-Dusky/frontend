import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const LOGGING_ENDPOINT = '/api/log';
const STATIC_FILE_PATTERN =
  /\.(?:css|js|map|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;

  if (!shouldSkipLogging(pathname)) {
    const payload = {
      level: 'verbose',
      message: 'Incoming frontend request',
      metadata: {
        method: request.method,
        path: `${pathname}${search}`,
        userAgent: request.headers.get('user-agent') ?? 'unknown',
        referer: request.headers.get('referer') ?? 'none',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
    };

    const loggingUrl = new URL(LOGGING_ENDPOINT, request.url);

    event.waitUntil(
      fetch(loggingUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }).catch(() => undefined),
    );
  }

  return NextResponse.next();
}

function shouldSkipLogging(pathname: string): boolean {
  return (
    pathname === LOGGING_ENDPOINT ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    STATIC_FILE_PATTERN.test(pathname)
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
