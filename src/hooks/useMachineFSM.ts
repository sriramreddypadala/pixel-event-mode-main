import { useEffect, useState, useCallback } from 'react';
import { getMachineFSM, MachineState, MachineEvent, MachineContext } from '@/machines/machineFSM';
import { useMachineStore } from '@/store/machineStore';

export function useMachineFSM() {
  const { mode, config } = useMachineStore();
  const [fsm] = useState(() => 
    getMachineFSM({
      mode,
      qrEnabled: config?.qrEnabled ?? true,
      sessionId: null,
      error: null,
    })
  );

  const [state, setState] = useState<MachineState>(fsm.getState());
  const [context, setContext] = useState<MachineContext>(fsm.getContext());

  useEffect(() => {
    const unsubscribe = fsm.subscribe((newState, newContext) => {
      setState(newState);
      setContext(newContext);
    });

    return unsubscribe;
  }, [fsm]);

  // Update FSM context when store changes
  useEffect(() => {
    fsm.updateContext({
      mode,
      qrEnabled: config?.qrEnabled ?? true,
    });
  }, [mode, config?.qrEnabled, fsm]);

  const send = useCallback((event: MachineEvent) => {
    return fsm.send(event);
  }, [fsm]);

  const canTransition = useCallback((eventType: MachineEvent['type']) => {
    return fsm.canTransition(eventType);
  }, [fsm]);

  const reset = useCallback(() => {
    fsm.reset();
  }, [fsm]);

  return {
    state,
    context,
    send,
    canTransition,
    reset,
  };
}
