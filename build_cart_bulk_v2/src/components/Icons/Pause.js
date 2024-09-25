import * as React from "react";

function Pause({ width = "16px", height = "16px", fill = "#565759" }) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.1 12.74V3.26C7.1 2.36 6.72 2 5.76 2H3.34C2.38 2 2 2.36 2 3.26v9.48c0 .9.38 1.26 1.34 1.26h2.42c.96 0 1.34-.36 1.34-1.26zM13.998 12.74V3.26c0-.9-.38-1.26-1.34-1.26h-2.42c-.953 0-1.34.36-1.34 1.26v9.48c0 .9.38 1.26 1.34 1.26h2.42c.96 0 1.34-.36 1.34-1.26z"
        fill={fill}
      />
    </svg>
  );
}

export default Pause;
