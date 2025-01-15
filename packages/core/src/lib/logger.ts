/* eslint-disable no-console */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  disabled?: boolean
}

class Logger {
  private level: LogLevel
  private prefix: string
  private disabled: boolean
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info'
    this.prefix = options.prefix || ''
    this.disabled = options.disabled || false
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.disabled) return false
    return this.levels[level] >= this.levels[this.level]
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    const prefix = this.prefix ? `[${this.prefix}]` : ''
    return `${timestamp} ${prefix}[${level.toUpperCase()}] ${message}`
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args)
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args)
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix
  }

  enable(): void {
    this.disabled = false
  }

  disable(): void {
    this.disabled = true
  }
}

export const logger = new Logger({
  level: import.meta.env.DEV ? 'debug' : 'info',
  prefix: 'MdEditor',
})

export { Logger }
export type { LogLevel, LoggerOptions }
