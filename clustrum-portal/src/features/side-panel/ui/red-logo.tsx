import React, { ReactElement } from 'react';

export function RedLogo(): ReactElement {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M0 4h10v10H0zm0 10h10v10H0zm10 0h10v10H10zm4-14h10v10H14z"
      />
    </svg>
  );
}
