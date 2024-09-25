import React, { useState } from "react";
import DisputeModal from "../../../../components/Vendors/DisputeModal";
import instance from "../../../../utility/webservices";
import { Text } from "@chakra-ui/react";
import { handleError } from "../../../../utility/helpers";
import useModalHandler from "../../../../components/Modals/SuccessModal";

const ModalMessage = ({}) => {
  return (
    <Text fontWeight="400">
      <b> Dispute opened.</b> <br /> An Admin has been notified and the dispute
      will be attended to shortly
    </Text>
  );
};

const OrderDisputeModal = ({ isOpen, onClose, onOpen, data }) => {
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const [isLoading, setLoading] = useState(false);
  const handleDispute = async (response) => {
    const contractId = data?.orders[0]?.ContractId;
    setLoading(true);

    try {
      const payload = {
        ...response,
      };
      await instance.post(`/builder/${contractId}/open-dispute`, payload);

      handleSuccessModal(<ModalMessage />, 5000);
      setTimeout(() => {
        onClose();
      }, 6000);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <DisputeModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onOpen={onOpen}
        onSubmit={handleDispute}
        userType="Vendor"
      />
      {ModalComponent}
    </div>
  );
};

export default OrderDisputeModal;
