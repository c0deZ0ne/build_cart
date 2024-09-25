import { Box, Button as ChakraButton, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { addTransparency } from "../../utility/helpers";
import Button from "../Button";
import SuccessMessage from "../SuccessMessage";
import BaseModal from "./Modal";
/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.message
 * @param {string} props.yesText
 * @param {string} props.noText
 * @param {() => void} props.onYes
 * @param {() =>  void} props.onNo
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {boolean} props.isLoading
 * @param {'basic' | 'colored'} props.buttonType
 * @param {boolean?} props.showSuccessMessage
 * @param {string?} props.successMessage
 * @returns
 */
const DialogModal = ({
  isOpen,
  onClose,
  message,
  title,
  noText = "No",
  yesText = "Yes",
  onNo,
  onYes,
  isLoading = false,
  buttonType = "colored",
  showSuccessMessage = false,
  successMessage = "Success!",
}) => {
  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose} size="md" title={title}>
        {showSuccessMessage ? (
          <SuccessMessage message={successMessage} />
        ) : (
          <Box width={"100%"} margin="0 auto">
            <Box textAlign="center" mt={5} mb={10} fontWeight={"500"}>
              {message}
            </Box>

            <SimpleGrid columns={2} gap={5}>
              {buttonType === "basic" && (
                <React.Fragment>
                  <Button
                    full
                    border={"1px solid transparent"}
                    isLoading={isLoading}
                    onClick={onYes}
                  >
                    {yesText}
                  </Button>
                  <Button
                    full
                    background="#FFFFFF"
                    color="#12355A"
                    border={"1px solid #12355A"}
                    isLoading={isLoading}
                    onClick={onNo}
                  >
                    {noText}
                  </Button>
                </React.Fragment>
              )}

              {buttonType === "colored" && (
                <React.Fragment>
                  <ChakraButton
                    fontWeight={600}
                    onClick={onYes}
                    isLoading={isLoading}
                    height={"40px"}
                    borderRadius={"8px"}
                    color={"#F5852C"}
                    backgroundColor={"white"}
                    border={"1px solid #F5852C"}
                    _hover={{ background: "#333333", color: "#fff" }}
                    loadingText="Please wait ..."
                  >
                    {yesText}
                  </ChakraButton>
                  <ChakraButton
                    onClick={onNo}
                    variant
                    isLoading={isLoading}
                    loadingText="Please wait ..."
                    color="#fff"
                    background="#F5852C"
                    height={"40px"}
                    fontWeight={600}
                    borderRadius={"8px"}
                    border={"1px solid transparent"}
                    _hover={{
                      background: addTransparency("#f5852c", 0.9),
                    }}
                  >
                    {noText}
                  </ChakraButton>
                </React.Fragment>
              )}
            </SimpleGrid>
          </Box>
        )}
      </BaseModal>
    </div>
  );
};

export default DialogModal;
