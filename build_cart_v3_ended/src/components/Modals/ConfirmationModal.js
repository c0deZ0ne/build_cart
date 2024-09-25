import React from "react";
import BaseModal from "./Modal";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import Button from "../Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  handleAction,
  message,
  title,
  isLoading,
  color = "#12355a",
}) => {
  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose} size="lg" title={title}>
        <Box width={"100%"} margin="0 auto">
          <Text textAlign="center" mt={5} mb={10}>
            {message}
          </Text>

          <SimpleGrid columns={2} gap={5}>
            <Button isLoading={isLoading} onClick={handleAction}>
              Yes
            </Button>
            <Button onClick={onClose} variant>
              No
            </Button>
          </SimpleGrid>
        </Box>
      </BaseModal>
    </div>
  );
};

export default ConfirmationModal;
