/**
 * Simple logger utility to replace @omnirealm/logger
 * Provides basic logging functionality with environment-aware output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  isDevelopment: boolean;
  enableConsole: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      isDevelopment: import.meta.env.DEV,
      enableConsole: import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOGS === 'true'
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enableConsole) return false;
    
    // In production, only log warnings and errors
    if (!this.config.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    
    return true;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: any, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();