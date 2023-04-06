import React, { useRef } from 'react';
import './GoToPage.css';

type Props = {
  goTo: (pageNumber: number) => void;
  disabled?: boolean;
};

export default function GoToPage({ goTo, disabled = false }: Props) {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleGoTo = () => {
    const inputValue = inputEl.current?.value;
    if (inputValue) {
      goTo(Number(inputValue));
    }
  };

  return (
    <div className={`pagination__go-to ${disabled ? 'pagination__go-to_disabled' : ''}`}>
      Перейти к
      <input
        disabled={disabled}
        className="pagination__go-to-input"
        ref={inputEl}
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            handleGoTo();
          }
        }}
      />
      <button disabled={disabled} className="pagination__go-to-btn" onClick={handleGoTo} />
    </div>
  );
}
