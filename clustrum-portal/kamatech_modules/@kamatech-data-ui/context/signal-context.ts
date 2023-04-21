import React from 'react';

export interface SignalContextModel {
  listeners: { [key: string]: Function[] };
  subscribe: (event: string, callback: Function) => void;
  unSubscribe: (event: string, callback: Function) => void;
  emit: (event: string, data: unknown) => void;
}

export const SignalContext = React.createContext<SignalContextModel>({
  listeners: {},

  subscribe(event: string, callback: Function): void {
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [];
    }

    const isCallbackExist = this.listeners[event].includes(callback);

    if (isCallbackExist) {
      const callbackIndex = this.listeners[event].findIndex(c => c === callback);

      this.listeners[event].splice(callbackIndex, 1, callback);
    } else {
      this.listeners[event].push(callback);
    }
  },

  unSubscribe(event: string, callback: Function): void {
    if (this.listeners[event] === undefined) {
      console.error('not found event');

      return;
    }

    const callbackIndex = this.listeners[event].findIndex(c => c === callback);

    if (callbackIndex === -1) {
      console.error('not found calback');

      return;
    }

    this.listeners[event].splice(callbackIndex, 1);
  },

  emit(event: string, data: unknown): void {
    const callbacks = this.listeners[event];

    if (callbacks) {
      return callbacks.forEach(callback => callback(data));
    }
  },
});
