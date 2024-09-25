import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";
import { useRateAnOrderMutation } from "../../redux/api/vendor/vendor";
import { handleSuccess } from "../../utility/helpers";
import Button from "../Button";
import { TextArea } from "../Input";
import BaseModal from "../Modals/Modal";
import StarRatings from "../StarRatings";

/**
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.contractId
 * @param {Function} props.refetchOrders
 * @returns
 */
const RateOrderModal = ({ isOpen, onClose, contractId, refetchOrders }) => {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");

  const [rateFn, { isLoading, isSuccess, isError, error }] =
    useRateAnOrderMutation();

  useEffect(() => {
    if (isSuccess) {
      handleSuccess("Builder Rated!");
      toast({
        status: "success",
        description: "Builder Rated!",
        position: "top-right",
      });
      refetchOrders();
      onClose();
    }

    if (isError && error) {
      // handleError(error);

      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: error.data.message,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error]);

  function submitRating() {
    const data = { rateScore: rating };

    if (!(ratingMessage.trim() === "")) {
      data.review = ratingMessage;
    }

    rateFn({ contractId: contractId, data: data });
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showHeader={false} size="lg">
      <Box color={"#666666"} py={"2rem"}>
        <Box mb={"40px"}>
          <Text fontSize={"24px"} fontWeight={600} align={"center"}>
            Rate Order
          </Text>
          <Flex align={"center"} justify={"center"} my={"40px"}>
            <StarRatings
              rating={rating}
              setRating={setRating}
              isEdittable
              iconSize="80px"
            />
          </Flex>

          <TextArea
            onChange={(e) => setRatingMessage(e.target.value)}
            value={ratingMessage}
          />
        </Box>

        {/* <Flex justify={"center"} gap={"12px"}>
          <Text color={"#666"}>
            <FaStar size={"32px"} color="#FFBD00" />
          </Text>
          <Text as={"span"} fontSize={"24px"} fontWeight={600}>
            3.8
          </Text>
        </Flex>

        <Text fontSize={"12px"} color={"#333"} align={"center"} mt={"8px"}>
          Overall Ratings
        </Text> */}
      </Box>
      <Box mt={"40px"}>
        <Button full onClick={submitRating} isLoading={isLoading}>
          Submit
        </Button>
      </Box>
    </BaseModal>
  );
};

export default RateOrderModal;
