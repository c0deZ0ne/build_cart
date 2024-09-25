import { Flex } from "@chakra-ui/react";
import { FaRegStar, FaStar } from "react-icons/fa";

/**
 * @param {{rating: number, iconSize: string, isEdittable: boolean, setRating: Function}} rating
 * @returns
 */
const StarRatings = ({
  rating,
  iconSize = "16px",
  isEdittable,
  setRating,
  gap = 0,
}) => {
  function handleClick(idx) {
    if (!isEdittable) return;
    setRating(idx + 1);
  }
  return (
    <Flex gap={gap} cursor={isEdittable ? "pointer" : "auto"}>
      {Array.from({ length: 5 }).map((_, idx) => {
        if (rating > idx)
          return (
            <FaStar
              color="#FFBD00"
              key={idx}
              size={iconSize}
              onClick={() => handleClick(idx)}
            />
          );
        else
          return (
            <FaRegStar
              color="#FFBD00"
              key={idx}
              size={iconSize}
              onClick={() => handleClick(idx)}
            />
          );
      })}
    </Flex>
  );
};

export default StarRatings;
