import * as React from "react";

export default function Naira({
  fill = "#12355A",
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
      <path
        d="M7 18V7.052a1.05 1.05 0 011.968-.51l6.064 10.916a1.05 1.05 0 001.968-.51V6M5 10h14M5 14h14"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
