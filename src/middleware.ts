import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const LOGGING_ENDPOINT = '/api/log';
const GOOGLE_AUTH_PATH_PREFIX = '/auth/google';
const STATIC_FILE_PATTERN =
  /\.(?:css|js|map|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;

  if (!shouldSkipLogging(request, pathname)) {
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

function shouldSkipLogging(request: NextRequest, pathname: string): boolean {
  const secFetchDest = (request.headers.get('sec-fetch-dest') ?? '').toLowerCase();
  const secFetchMode = (request.headers.get('sec-fetch-mode') ?? '').toLowerCase();
  const acceptHeader = (request.headers.get('accept') ?? '').toLowerCase();
  const purposeHeader = request.headers.get('purpose') ?? '';
  const secPurposeHeader = request.headers.get('sec-purpose') ?? '';
  const isDocumentNavigation =
    secFetchDest === 'document' ||
    (secFetchMode === 'navigate' && acceptHeader.includes('text/html'));
  const isPrefetchRequest =
    request.headers.has('next-router-prefetch') ||
    purposeHeader.toLowerCase().includes('prefetch') ||
    secPurposeHeader.toLowerCase().includes('prefetch');

  return (
    !isDocumentNavigation ||
    isPrefetchRequest ||
    pathname === LOGGING_ENDPOINT ||
    pathname.startsWith(GOOGLE_AUTH_PATH_PREFIX) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    STATIC_FILE_PATTERN.test(pathname)
  );
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
