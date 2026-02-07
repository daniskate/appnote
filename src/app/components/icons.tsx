import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18a1.5 1.5 0 0 0 1.5-1.5v0a1.5 1.5 0 0 0-1.5-1.5v0a1.5 1.5 0 0 0-1.5 1.5v0A1.5 1.5 0 0 0 12 18Z" />
    <path d="M8.5 14.5a1 1 0 0 0 1-1v0a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1Z" />
    <path d="M15.5 11.5a1 1 0 0 0 1-1v0a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1Z" />
  </svg>
);
