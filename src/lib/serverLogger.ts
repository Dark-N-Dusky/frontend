import { appendFile, mkdir, rename, rm, stat } from 'fs/promises';
import { join } from 'path';

const LOG_DIRECTORY = join(process.cwd(), 'logs');
const FRONTEND_LOG_FILE = join(LOG_DIRECTORY, 'frontend.log');
const MAX_LOG_FILE_SIZE_BYTES = Number(
  process.env.FRONTEND_LOG_MAX_SIZE_BYTES ?? 5 * 1024 * 1024,
);
const MAX_LOG_FILES = Number(process.env.FRONTEND_LOG_MAX_FILES ?? 7);

type FrontendLogLevel = 'verbose' | 'warn' | 'error';

export type FrontendLogEntry = {
  level: FrontendLogLevel;
  message: string;
  metadata?: Record<string, unknown>;
};

let writeQueue: Promise<void> = Promise.resolve();

export function writeFrontendLog(entry: FrontendLogEntry): Promise<void> {
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      const line = formatLogLine(entry);

      await mkdir(LOG_DIRECTORY, { recursive: true });
      await rotateLogsIfNeeded(Buffer.byteLength(line, 'utf8'));
      await appendFile(FRONTEND_LOG_FILE, line, 'utf8');
    });

  return writeQueue;
}

function formatLogLine(entry: FrontendLogEntry): string {
  const metadata =
    entry.metadata && Object.keys(entry.metadata).length > 0
      ? ` ${JSON.stringify(entry.metadata)}`
      : '';

  return `${new Date().toISOString()} [${entry.level.toUpperCase()}] ${entry.message}${metadata}\n`;
}

async function rotateLogsIfNeeded(bytesToWrite: number): Promise<void> {
  let existingSize = 0;

  try {
    const stats = await stat(FRONTEND_LOG_FILE);
    existingSize = stats.size;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  if (existingSize + bytesToWrite <= MAX_LOG_FILE_SIZE_BYTES) {
    return;
  }

  await rm(`${FRONTEND_LOG_FILE}.${MAX_LOG_FILES}`, { force: true });

  for (let index = MAX_LOG_FILES - 1; index >= 1; index -= 1) {
    await safeRename(
      `${FRONTEND_LOG_FILE}.${index}`,
      `${FRONTEND_LOG_FILE}.${index + 1}`,
    );
  }

  await safeRename(FRONTEND_LOG_FILE, `${FRONTEND_LOG_FILE}.1`);
}

async function safeRename(source: string, destination: string): Promise<void> {
  try {
    await rename(source, destination);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== 'ENOENT') {
      throw error;
    }
  }
}
