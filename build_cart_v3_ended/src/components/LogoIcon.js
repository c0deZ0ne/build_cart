import React from "react";

export default function LogoIcon({ fill = "#12355B" }) {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M27.7359 11.4187V16.1788L0 9.38529V4.62305L27.7359 11.4187Z"
          fill={fill}
        />
        <path
          d="M27.7359 0V4.62231H0V2.31115C0 1.03471 1.55208 0 3.46673 0H27.7359Z"
          fill={fill}
        />
        <path
          d="M27.7359 19.2389V23.9992L0 17.2056V12.4434L27.7359 19.2389Z"
          fill="#F5862E"
        />
      </g>
    </svg>
  );
}
