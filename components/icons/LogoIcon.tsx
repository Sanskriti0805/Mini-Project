
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    <path d="M12 12.83l3 2.25-3 2.25v-4.5zm-3-2.25l3 2.25v-4.5l-3 2.25z" fillOpacity="0.7"/>
  </svg>
);
