/* eslint-disable no-console */
import type { LoggerCapability, LoggerOptions, LogLevel } from '../types'

export class WebLogger implements LoggerCapability {
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

  private formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
      date.getHours(),
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds())}`
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.formatTimestamp(new Date())
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
