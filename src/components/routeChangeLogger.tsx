'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const LOGGING_ENDPOINT = '/api/log';
const GOOGLE_AUTH_PATH_PREFIX = '/auth/google';

export default function RouteChangeLogger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasMountedRef = useRef(false);
  const previousPathRef = useRef<string>('none');

  useEffect(() => {
    const query = searchParams.toString();
    const currentPath = query ? `${pathname}?${query}` : pathname;
    const shouldSkipPath = pathname.startsWith(GOOGLE_AUTH_PATH_PREFIX);

    if (shouldSkipPath) {
      hasMountedRef.current = true;
      previousPathRef.current = 'none';
      return;
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousPathRef.current = currentPath;
      return;
    }

    const payload = {
      level: 'verbose',
      message: 'Frontend client navigation',
      metadata: {
        method: 'GET',
        path: currentPath,
        referer: previousPathRef.current,
        userAgent:
          typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent,
        source: 'client-router',
      },
    };

    previousPathRef.current = currentPath;

    void fetch(LOGGING_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: 'no-store',
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
