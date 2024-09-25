import {
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  Text,
  PopoverContent,
  PopoverTrigger,
  Box,
  PopoverCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PaymentSubscriptionModal from "../Modals/PaymentSubscriptionModal";

const SidebarPopup = ({ isOpenPopup = true, closeSidebar, children }) => {
  const [open, setOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSubscriptionModal,
    onOpen: onOpenSubscriptionModal,
    onClose: onCloseSubscriptionModal,
  } = useDisclosure();
  const handleSubcription = () => {
    onClose();
    setOpen(true);
    onOpenSubscriptionModal();
  };

  return (
    <>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <Box pos="relative" onClick={onOpen} ml={"10px"}>
            {children}
          </Box>
        </PopoverTrigger>
        {isOpenPopup && (
          <PopoverContent
            color="rgba(51, 51, 51, 0.56)"
            w={"70%"}
            overflowY={"auto"}
          >
            <PopoverArrow bg={"#fff"} />
            <PopoverCloseButton />
            <PopoverBody fontWeight="400" textAlign="left" fontSize="14px">
              <Text
                as="span"
                color="secondary"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                onClick={handleSubcription}
              >
                SUBSCRIBE
              </Text>{" "}
              to access all the features of the platform.
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>

      {open && (
        <PaymentSubscriptionModal
          isOpen={isOpenSubscriptionModal}
          onOpen={onOpenSubscriptionModal}
          onClose={onCloseSubscriptionModal}
          onCloseSubscription={onCloseSubscriptionModal}
          closeSidebar={closeSidebar}
        />
      )}
    </>
  );
};

export default SidebarPopup;
