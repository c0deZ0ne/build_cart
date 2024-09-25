import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

function CircularProgress({ progress }) {
  const circleLength = useTransform(progress, [0, 100], [0, 1]);
  const checkMarkOpacity = useTransform(progress, [0, 95, 100], [0, 0, 1]);
  const circleColor = useTransform(
    progress,
    [0, 95, 100],
    ["#66BB66", "#66BB66", "#66BB66"]
  );

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="200"
      viewBox="0 0 258 258"
    >
      {/* Check mark  */}
      <motion.path
        transform="translate(60 85)"
        d="M 46.477 100.11 L 0 53.633 L 5.931 47.703 L 46.477 88.249 L 134.729 0 L 140.66 5.93 Z"
        fill="#66BB66"
        opacity={checkMarkOpacity}
      />
      {/* Circle */}
      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill="transparent"
        strokeWidth="8"
        stroke={circleColor}
        style={{
          pathLength: circleLength,
        }}
      />
    </motion.svg>
  );
}

const Checkmark = () => {
  let progress = useMotionValue(90);
  return (
    <div className="App">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        style={{ x: progress }}
        transition={{ duration: 0.5 }}
      />
      <CircularProgress progress={progress} />
    </div>
  );
};

export default Checkmark;
