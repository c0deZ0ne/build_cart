import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Button as ButtonBox } from "@chakra-ui/button";
import BaseModal from "../../../../../components/Modals/Modal";
import Input from "../../../../../components/Input";
import Button from "../../../../../components/Button";
import instance from "../../../../../utility/webservices";
import { handleError } from "../../../../../utility/helpers";
import SuccessMessage from "../../../../../components/SuccessMessage";

export default function RequestCheckModal({
  setOpenResolve,
  openResolve,
  requestType,
  request,
  getAllRequest,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [changeAction, setChangeAction] = useState(false);
  const [value, setValue] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const confirmContact = () => {
    setChangeAction(true);
  };

  const submit = async () => {
    setIsLoading(true);
    const payload = {};
    payload[`${requestType === "email" ? "email" : "phoneNumber"}`] = value;
    try {
      const response = await instance.patch(
        `/support-recovery/${request?.userId}/update`,
        payload
      );

      if (response.status === 200) {
        getAllRequest();
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <BaseModal
      isOpen={openResolve}
      onClose={() => (
        setOpenResolve(false), setChangeAction(false), setValue("")
      )}
      size="2xl"
      title={
        requestType === "email" && !changeAction
          ? "Email change"
          : requestType === "phone" && !changeAction
          ? "Phone number change"
          : requestType === "email" && changeAction
          ? "Change Email"
          : "Change phone number"
      }
      subtitle={
        requestType === "email" && changeAction
          ? "Enter the customers new email"
          : requestType === "phone" && changeAction
          ? "Enter the customers new phone number"
          : ""
      }
    >
      {changeAction ? (
        <>
          {isSuccess ? (
            <SuccessMessage message="Info updated successfully." />
          ) : (
            <Box>
              <Box mt={"10px"} mb="40px" w={"100%"}>
                <Input
                  placeholder={
                    requestType === "email"
                      ? "Enter the email supplied by the customer"
                      : "Enter the phone number supplied by the customer"
                  }
                  value={value}
                  label={
                    requestType === "email"
                      ? "Enter New Email"
                      : "Enter New Phone Number"
                  }
                  type={requestType === "email" ? "email" : "text"}
                  isRequired
                  onChange={(e) => setValue(e.target.value)}
                />
              </Box>

              <Button mb={10} full onClick={submit} isLoading={isLoading}>
                Update
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Text mb="60px" fontSize="20px" fontWeight="500" textAlign="center">
            {requestType === "email"
              ? "Have you contacted the user to verify last activity information?"
              : "Have you contacted the user to verify last activity information?"}
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
              onClick={confirmContact}
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
              onClick={() => (setOpenResolve(false), setChangeAction(false))}
            >
              No
            </Box>
          </Flex>
        </Box>
      )}
    </BaseModal>
  );
}
