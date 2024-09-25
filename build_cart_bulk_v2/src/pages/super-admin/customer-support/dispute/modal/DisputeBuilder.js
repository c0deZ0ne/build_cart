import { Box, FormLabel } from "@chakra-ui/react";
import React from "react";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import BaseModal from "../../../../../components/Modals/Modal";
import StarRatings from "../../../../../components/StarRatings";

const DisputeBuilder = ({ data, isOpen, onClose, setNext }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Builder Business Information"
      subtitle="Builder’s business information."
    >
      <Box fontSize="14px" mb="40px">
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="name"
            value={data?.businessName || ""}
            label="Vendor Name"
            isDisabled
            disabled
          />
        </Box>
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <FormLabel
            mb="0"
            textTransform="capitalize"
            fontWeight="400"
            fontSize="15px"
            opacity="0.4"
          >
            Ratings (No real data from API)
          </FormLabel>
          <StarRatings rating={3} />,
        </Box>
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="order"
            value={data?.completedOrder || "No data from API"}
            label="Completed Orders"
            isDisabled
            disabled
          />
        </Box>
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="phone"
            value={data?.phone || data?.email || ""}
            label="Phone Number (No phone number from API so I show email)"
            isDisabled
            disabled
          />
        </Box>
      </Box>

      <Button mb={10} full onClick={() => setNext(true)} mr={3}>
        I’ve contacted the seller
      </Button>
    </BaseModal>
  );
};

export default DisputeBuilder;
