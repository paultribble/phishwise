import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

const pinoLogger = pino(
  { level: isDev ? 'debug' : 'info' },
  isDev
    ? pino.transport({ target: 'pino-pretty', options: { colorize: true } })
    : undefined
)

export function apiLogger(route: string) {
  return pinoLogger.child({ route })
}

interface LogContext {
  route?: string;
  userId?: string;
  schoolId?: string;
  error?: Error | string;
  [key: string]: unknown;
}

function formatLog(level: string, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      context: context || {},
    });
  } else {
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(formatLog('INFO', message, context));
  },
  warn: (message: string, context?: LogContext) => {
    console.warn(formatLog('WARN', message, context));
  },
  error: (message: string, context?: LogContext) => {
    console.error(formatLog('ERROR', message, context));
  },
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('DEBUG', message, context));
    }
  },
};
