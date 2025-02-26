import * as React from "react";

export default function InfoIcon({
  fill = "#999999",
  width = "14px",
  height = "14px",
  opacity = "0.56",
}) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={opacity}>
        <path
          d="M7.003.332C3.329.332.336 3.325.336 6.999c0 3.673 2.993 6.666 6.667 6.666 3.673 0 6.666-2.993 6.666-6.666 0-3.674-2.993-6.667-6.666-6.667zm-.5 4c0-.273.226-.5.5-.5.273 0 .5.227.5.5v3.333c0 .274-.227.5-.5.5a.504.504 0 01-.5-.5V4.332zm1.113 5.587a.688.688 0 01-.14.22.77.77 0 01-.22.14.664.664 0 01-.253.053.664.664 0 01-.254-.053.77.77 0 01-.22-.14.688.688 0 01-.14-.22.664.664 0 01-.053-.254c0-.086.02-.173.053-.253a.77.77 0 01.14-.22.77.77 0 01.22-.14.667.667 0 01.507 0 .77.77 0 01.22.14.77.77 0 01.14.22c.033.08.053.167.053.253 0 .087-.02.174-.053.254z"
          fill={fill}
        />
      </g>
    </svg>
  );
}
