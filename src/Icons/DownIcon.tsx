import React from "react";

interface IDownIconProps {
  color?: string;
  className?: string;
}

export function DownIcon({ color = "#333", className }: IDownIconProps) {
  return (
    <svg
      className={className + " downIcon"}
      width="89"
      height="64"
      viewBox="0 0 89 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L44.5 58L83 6"
        stroke={color}
        strokeWidth="11.3386"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
