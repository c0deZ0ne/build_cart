import React, { useState } from "react";
import BaseModal from "./Modal";
import { Box } from "@chakra-ui/react";
import SuccessMessage from "../SuccessMessage";

const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose} showHeader={false}>
        <Box width={"80%"} margin="0 auto">
          <SuccessMessage message={message} />
        </Box>
      </BaseModal>
    </div>
  );
};

const useModalHandler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuccessModal = (message, duration, action = false) => {
    setMessage(message);
    setIsOpen(true);

    // Close the modal after 3 seconds

    setTimeout(() => {
      setIsOpen(action ? action : false);
    }, duration ?? 3000);
  };

  return {
    handleSuccessModal,
    ModalComponent: (
      <SuccessModal
        isOpen={isOpen}
        message={message}
        onClose={() => setIsOpen(false)}
      />
    ),
  };
};

export default useModalHandler;
