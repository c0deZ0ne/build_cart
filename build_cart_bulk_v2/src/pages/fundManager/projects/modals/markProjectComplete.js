import { Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../../../../components/Button";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import instance from "../../../../utility/webservices";
import { handleError } from "../../../../utility/helpers";

const MarkProjectComplete = ({ onClose, projectId }) => {
  const [isLoading, setLoading] = useState(false);
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const handleCompleteProject = async () => {
    setLoading(true);

    try {
      await instance.get(`/fundManager/project/${projectId}/complete`);

      handleSuccessModal("You have successfully completed this project.");
      onClose();
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  return (
    <div>
      <Text textAlign="center">
        Are you sure you want to mark this project as complete?
      </Text>

      <VStack mt={10} gap={4}>
        <Button
          full
          variant
          isLoading={isLoading}
          onClick={handleCompleteProject}
        >
          Yes, Mark Project as Complete
        </Button>

        <Button full variant onClick={onClose}>
          No
        </Button>
      </VStack>

      {ModalComponent}
    </div>
  );
};

export default MarkProjectComplete;
