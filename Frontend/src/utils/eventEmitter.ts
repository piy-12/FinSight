type Listener = (...args: any[]) => void;

class EventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, listener: Listener): () => void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners[event] = (this.listeners[event] || []).filter(
      l => l !== listener,
    );
  }

  emit(event: string, ...args: any[]): void {
    (this.listeners[event] || []).forEach(l => l(...args));
  }
}

export const appEvents = new EventEmitter();

export const APP_EVENTS = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;
