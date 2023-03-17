import React from 'react';

export default function useDebounce(func, debounceTime) {
  const [timeoutId, setTimeoutId] = React.useState(0);

  return (...args) => {
    clearTimeout(timeoutId);
    const timeout = setTimeout(() => {
      func(...args);
      clearTimeout(timeoutId);
      setTimeoutId(0);
    }, debounceTime);
    setTimeoutId(timeout);
  };
}
