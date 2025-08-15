/**
 * Simple logger for OmniTask
 * Replaces @omnirealm/logger dependency
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled?: boolean;
  level?: LogLevel;
}

class Logger {
  private enabled: boolean;
  private level: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(private context: string, config?: LoggerConfig) {
    this.enabled = config?.enabled ?? process.env.NODE_ENV !== 'production';
    this.level = config?.level ?? 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabled && this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    
    console[level === 'debug' ? 'log' : level](prefix, message, data || '');
  }

  debug(message: string, data?: any): void {
    this.formatMessage('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.formatMessage('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.formatMessage('warn', message, data);
  }

  error(message: string, error?: any): void {
    this.formatMessage('error', message, error);
  }
}

export function createLogger(context: string, config?: LoggerConfig): Logger {
  return new Logger(context, config);
}

// Named export for logger instance
export const logger = createLogger('default');

// Default export for backward compatibility
const loggerModule = {
  createLogger
};

export default loggerModule;