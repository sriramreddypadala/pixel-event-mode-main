// ====================================================
// FINITE STATE MACHINE - MACHINE FLOW
// ====================================================

export type MachineState = 
  | 'IDLE'
  | 'SETUP'
  | 'CAPTURE'
  | 'PAYMENT'
  | 'PRINTING'
  | 'QR'
  | 'THANK_YOU'
  | 'ERROR';

export type MachineEvent =
  | { type: 'START' }
  | { type: 'SETUP_COMPLETE' }
  | { type: 'CAPTURE_COMPLETE' }
  | { type: 'PAYMENT_COMPLETE' }
  | { type: 'SKIP_PAYMENT' }
  | { type: 'PRINTING_COMPLETE' }
  | { type: 'QR_COMPLETE' }
  | { type: 'SKIP_QR' }
  | { type: 'THANK_YOU_COMPLETE' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }
  | { type: 'CANCEL' };

export type MachineContext = {
  mode: 'NORMAL' | 'EVENT';
  qrEnabled: boolean;
  sessionId: string | null;
  error: string | null;
};

type StateTransition = {
  [K in MachineState]?: {
    [E in MachineEvent['type']]?: MachineState;
  };
};

// ====================================================
// STATE TRANSITION TABLE
// ====================================================

const transitions: StateTransition = {
  IDLE: {
    START: 'SETUP',
    ERROR: 'ERROR',
  },
  SETUP: {
    SETUP_COMPLETE: 'CAPTURE',
    CANCEL: 'IDLE',
    ERROR: 'ERROR',
  },
  CAPTURE: {
    CAPTURE_COMPLETE: 'PAYMENT', // Will be overridden by guard for EVENT mode
    CANCEL: 'IDLE',
    ERROR: 'ERROR',
  },
  PAYMENT: {
    PAYMENT_COMPLETE: 'PRINTING',
    CANCEL: 'IDLE',
    ERROR: 'ERROR',
  },
  PRINTING: {
    PRINTING_COMPLETE: 'QR', // Will be overridden by guard if QR disabled
    ERROR: 'ERROR',
  },
  QR: {
    QR_COMPLETE: 'THANK_YOU',
    SKIP_QR: 'THANK_YOU',
    ERROR: 'ERROR',
  },
  THANK_YOU: {
    THANK_YOU_COMPLETE: 'IDLE',
    RESET: 'IDLE',
  },
  ERROR: {
    RESET: 'IDLE',
    CANCEL: 'IDLE',
  },
};

// ====================================================
// GUARDS - CONDITIONAL LOGIC
// ====================================================

const guards = {
  shouldSkipPayment: (context: MachineContext): boolean => {
    return context.mode === 'EVENT';
  },
  shouldSkipQR: (context: MachineContext): boolean => {
    return !context.qrEnabled;
  },
};

// ====================================================
// FSM CLASS
// ====================================================

export class MachineFSM {
  private state: MachineState;
  private context: MachineContext;
  private listeners: Set<(state: MachineState, context: MachineContext) => void>;

  constructor(initialContext: MachineContext) {
    this.state = 'IDLE';
    this.context = initialContext;
    this.listeners = new Set();
    this.restoreState();
  }

  // Get current state
  getState(): MachineState {
    return this.state;
  }

  // Get current context
  getContext(): MachineContext {
    return { ...this.context };
  }

  // Update context
  updateContext(updates: Partial<MachineContext>): void {
    this.context = { ...this.context, ...updates };
    this.persistState();
    this.notifyListeners();
  }

  // Send event to FSM
  send(event: MachineEvent): boolean {
    const currentState = this.state;
    const eventType = event.type;

    // Apply guards for special transitions
    let nextState = transitions[currentState]?.[eventType];

    if (!nextState) {
      console.warn(`[FSM] No transition for ${currentState} -> ${eventType}`);
      return false;
    }

    // Guard: Skip payment in EVENT mode
    if (currentState === 'CAPTURE' && eventType === 'CAPTURE_COMPLETE') {
      if (guards.shouldSkipPayment(this.context)) {
        nextState = 'PRINTING';
      }
    }

    // Guard: Skip QR if disabled
    if (currentState === 'PRINTING' && eventType === 'PRINTING_COMPLETE') {
      if (guards.shouldSkipQR(this.context)) {
        nextState = 'THANK_YOU';
      }
    }

    // Handle ERROR event
    if (eventType === 'ERROR') {
      this.context.error = (event as { type: 'ERROR'; error: string }).error;
      nextState = 'ERROR';
    }

    // Transition to next state
    this.state = nextState;
    this.persistState();
    this.notifyListeners();

    console.log(`[FSM] ${currentState} -> ${nextState} (${eventType})`);
    return true;
  }

  // Check if transition is allowed
  canTransition(eventType: MachineEvent['type']): boolean {
    return !!transitions[this.state]?.[eventType];
  }

  // Subscribe to state changes
  subscribe(listener: (state: MachineState, context: MachineContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state, this.context));
  }

  // Persist state to localStorage
  private persistState(): void {
    try {
      localStorage.setItem('machine-fsm-state', JSON.stringify({
        state: this.state,
        context: this.context,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('[FSM] Failed to persist state:', error);
    }
  }

  // Restore state from localStorage
  private restoreState(): void {
    try {
      const stored = localStorage.getItem('machine-fsm-state');
      if (!stored) return;

      const { state, context, timestamp } = JSON.parse(stored);
      const age = Date.now() - timestamp;

      // Only restore if less than 5 minutes old
      if (age < 5 * 60 * 1000) {
        // Don't restore terminal states
        if (state !== 'IDLE' && state !== 'THANK_YOU' && state !== 'ERROR') {
          this.state = state;
          this.context = { ...this.context, ...context };
          console.log(`[FSM] Restored state: ${state}`);
        }
      }
    } catch (error) {
      console.error('[FSM] Failed to restore state:', error);
    }
  }

  // Reset FSM to initial state
  reset(): void {
    this.state = 'IDLE';
    this.context.error = null;
    this.context.sessionId = null;
    this.persistState();
    this.notifyListeners();
    console.log('[FSM] Reset to IDLE');
  }
}

// ====================================================
// SINGLETON INSTANCE
// ====================================================

let fsmInstance: MachineFSM | null = null;

export const getMachineFSM = (context?: MachineContext): MachineFSM => {
  if (!fsmInstance && context) {
    fsmInstance = new MachineFSM(context);
  }
  if (!fsmInstance) {
    throw new Error('[FSM] Must initialize with context first');
  }
  return fsmInstance;
};

export const resetMachineFSM = (): void => {
  fsmInstance?.reset();
};
