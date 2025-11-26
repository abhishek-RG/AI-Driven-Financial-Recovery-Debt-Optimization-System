export type FinancialRealtimePayload = {
  entity: 'transaction' | 'invoice' | 'loan';
  action: 'create' | 'delete';
};

const EVENT_NAME = 'financial-data-updated';

export const emitFinancialDataUpdate = (payload: FinancialRealtimePayload) => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<FinancialRealtimePayload>(EVENT_NAME, { detail: payload });
  window.dispatchEvent(event);
};

export const subscribeFinancialDataUpdate = (
  handler: (payload: FinancialRealtimePayload) => void,
) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<FinancialRealtimePayload>;
    handler(customEvent.detail);
  };

  window.addEventListener(EVENT_NAME, listener as EventListener);

  return () => {
    window.removeEventListener(EVENT_NAME, listener as EventListener);
  };
};

