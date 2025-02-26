import * as React from "react";

export default function LocationIcon({
  fill = "#999999",
  width = "24",
  height = "24",
}) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#prefix__clip0_5388_40343)">
        <path
          d="M20.617 8.45c-1.05-4.62-5.08-6.7-8.62-6.7h-.01c-3.53 0-7.57 2.07-8.62 6.69-1.17 5.16 1.99 9.53 4.85 12.28a5.436 5.436 0 003.78 1.53c1.36 0 2.72-.51 3.77-1.53 2.86-2.75 6.02-7.11 4.85-12.27zm-8.62 5.01a3.15 3.15 0 110-6.3 3.15 3.15 0 010 6.3z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_5388_40343">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
