import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

export default function BaseModal({
  children,
  isOpen,
  onClose,
  title,
  subtitle,
  reset,
  showHeader = true,
  size = "2xl",
  bodyOverflow = "auto",
  bg = "#fff",
}) {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        elevation={0}
        size={size}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset && reset();
        }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent mx={2} bg={bg}>
          {showHeader ? (
            <Box
              bg={showHeader ? "primary" : "white"}
              color="white"
              rounded={"6px 6px 0 0"}
              p={"30px 20px"}
            >
              <>
                <Text fontWeight={700} fontSize={"24px"} mt={3}>
                  {title}
                </Text>
                <Text>{subtitle}</Text>
              </>

              <ModalCloseButton
                mt={10}
                fontSize="10px"
                color="primary"
                bg="#fff"
                mx="10px"
                rounded="50%"
              />
            </Box>
          ) : (
            <ModalCloseButton
              fontSize="10px"
              color="primary"
              bg="#fff"
              mx="10px"
              rounded="50%"
            />
          )}

          <ModalBody pt={6} pb={12} overflow={bodyOverflow}>
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
