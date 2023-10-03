import React from "react";

interface ICheckboxIconProps {
  checked: boolean;
}

export function CheckboxIcon({ checked }: ICheckboxIconProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 141.7 141.7"
      xmlSpace="preserve"
    >
      {checked && (
        <path
          d="M62.4,106.2c-2.9,0-5.6-1.1-7.7-3L31.4,81.9c-2.9-2.6-3.1-7.1-0.5-10c2.6-2.9,7.1-3.1,10-0.5l21.2,19.4
                l47.1-53.2c2.6-2.9,7.1-3.2,10-0.6c2.9,2.6,3.2,7.1,0.6,10l-49.1,55.3c-2,2.3-4.9,3.6-7.9,3.8C62.7,106.2,62.6,106.2,62.4,106.2z
                M64.3,92.7L64.3,92.7C64.3,92.7,64.3,92.7,64.3,92.7z"
          fill="#ff5100"
        />
      )}
    </svg>
  );
}
