import type { SVGProps } from "react";

export function CakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2" />
      <path d="M12 4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2V6c0-1.1-.9-2-2-2z" />
      <path d="M12 11h.01" />
      <path d="M7 11h.01" />
      <path d="M17 11h.01" />
    </svg>
  );
}
