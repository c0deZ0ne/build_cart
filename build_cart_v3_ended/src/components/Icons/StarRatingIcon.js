import React from "react";

const StarRatingIcon = ({
  overallRating,
  width = "28px",
  height = "28px",
  fill = "#FFBD00",
}) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={`url(#star-gradient-${overallRating})`}
        style={{ width: width, height: height }} // Adjust the width and height as needed
      >
        <defs>
          <linearGradient
            id={`star-gradient-${overallRating}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: fill, stopOpacity: 1 }} />
            <stop
              offset={`${overallRating * 20}%`}
              style={{ stopColor: fill, stopOpacity: 1 }}
            />
            <stop
              offset={`${overallRating * 10}%`}
              style={{ stopColor: "transparent", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M15.668 8.626l8.332 1.159-6.065 5.874 1.48 8.341-7.416-3.997-7.416 3.997 1.481-8.341-6.064-5.874 8.331-1.159 3.668-7.626 3.669 7.626z"
          stroke={fill} // Add stroke attribute for outline
          strokeWidth="1.5" // Adjust the stroke width as needed
        />
      </svg>
    </div>
  );
};

export default StarRatingIcon;
