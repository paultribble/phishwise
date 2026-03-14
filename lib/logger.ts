import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

export const logger = pino(
  { level: isDev ? 'debug' : 'info' },
  isDev
    ? pino.transport({ target: 'pino-pretty', options: { colorize: true } })
    : undefined
)

export function apiLogger(route: string) {
  return logger.child({ route })
}
