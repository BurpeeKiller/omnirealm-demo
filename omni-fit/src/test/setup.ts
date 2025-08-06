import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock des APIs browser qui ne sont pas disponibles dans jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: class MockNotification {
    constructor(title: string, options?: NotificationOptions) {}
    static permission = 'granted';
    static requestPermission = vi.fn().mockResolvedValue('granted');
  },
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn(),
});

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  volume: 1,
  src: '',
}));

// Mock IndexedDB (pour Dexie) - Version complète
import 'fake-indexeddb/auto';

// Mock plus complet pour Dexie
global.indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  databases: vi.fn().mockResolvedValue([]),
  cmp: vi.fn(),
} as any;

// Mock supplémentaire pour Framer Motion
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock MediaQueryList pour framer-motion prefers-reduced-motion
Object.defineProperty(window, 'MediaQueryList', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Correction du mock matchMedia pour framer-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated mais requis
    removeListener: vi.fn(), // deprecated mais requis
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
