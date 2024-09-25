import { Box, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../../../../../components/Button";
import instance from "../../../../../utility/webservices";
import { handleError } from "../../../../../utility/helpers";
// import BusinessDocs from "./businessDocs";
import { Button as ButtonBox } from "@chakra-ui/button";

const ResolveDispute = ({ data, getAllDispute, onClose }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState("");

  const resolveOrder = async () => {
    setIsLoading(true);
    try {
      const response = await instance.patch(
        `/support-admin-dispute/dispute/${data?.id}/resolve`
      );
      if (response.status === 200) {
        getAllDispute();
        setShowWarning(false);
        onClose();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refundOrder = async () => {
    setIsLoading(true);
    try {
      const response = await instance.patch(
        `/support-admin-dispute/dispute/${data?.id}/refund`
      );
      if (response.status === 200) {
        getAllDispute();
        setShowWarning(false);
        onClose();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const action = () => {
    if (actionType === "markComplete") {
      resolveOrder();
    } else if (actionType === "refund") {
      refundOrder();
    }
  };

  const setAction = (action) => {
    setActionType(action);
    setShowWarning(true);
  };

  return (
    <div>
      {showWarning ? (
        <Box>
          <Text mb="60px" fontSize="20px" fontWeight="500" textAlign="center">
            Are you sure you want to take this action?
          </Text>
          <Flex align="center" justify="space-evenly">
            <ButtonBox
              as="button"
              bgColor="secondary"
              color="#fff"
              p="16px 13px"
              borderRadius="8px"
              cursor="pointer"
              w="243px"
              h="56px"
              onClick={action}
              isLoading={isLoading}
            >
              Yes
            </ButtonBox>
            <Box
              as="button"
              bgColor="#fff"
              color="secondary"
              border="1px solid #F5852C"
              p="16px 13px"
              borderRadius="8px"
              cursor="pointer"
              w="243px"
              h="56px"
              onClick={() => setShowWarning(false)}
            >
              No
            </Box>
          </Flex>
        </Box>
      ) : (
        <VStack fontSize="14px" mb="40px">
          <Box
            as="button"
            bgColor="secondary"
            color="#fff"
            p="16px 13px"
            borderRadius="8px"
            cursor="pointer"
            w="265px"
            mb="24px"
            mt="24px"
            onClick={() => setAction("refund")}
          >
            Cancel order and refund buyer
          </Box>
          <Box
            as="button"
            bgColor="#fff"
            color="secondary"
            border="1px solid #F5852C"
            p="16px 13px"
            borderRadius="8px"
            cursor="pointer"
            w="265px"
            mb="24px"
            onClick={() => setAction("markComplete")}
          >
            Mark order as complete
          </Box>
          <Box
            as="button"
            bgColor="#fff"
            color="secondary"
            border="1px solid #F5852C"
            p="16px 13px"
            borderRadius="8px"
            cursor="pointer"
            w="265px"
            onClick={() => setAction("reopenOrder")}
          >
            Re-open order
          </Box>
        </VStack>
      )}
    </div>
  );
};

export default ResolveDispute;
