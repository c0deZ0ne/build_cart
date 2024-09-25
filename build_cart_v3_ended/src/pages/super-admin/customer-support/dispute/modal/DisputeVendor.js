import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import React from "react";
import Button from "../../../../../components/Button";
import Input, { TextArea } from "../../../../../components/Input";
import { FaCloudUploadAlt } from "react-icons/fa";
import BaseModal from "../../../../../components/Modals/Modal";
import StarRatings from "../../../../../components/StarRatings";

const DisputeVendor = ({ data, isOpen, onClose, setNext }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Vendor Business Information"
      subtitle="Vendor’s business information."
    >
      <Box fontSize="14px" mb="40px">
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="name"
            value={data?.businessName}
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
            placeholder="type"
            value={data?.VendorType}
            label="Vendor Type"
            isDisabled
            disabled
          />
        </Box>
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="phone"
            value={data?.phone}
            label="Phone Number"
            isDisabled
            disabled
          />
        </Box>
      </Box>

      <Button mb={10} full onClick={() => setNext(true)} mr={3}>
        I’ve contacted the customer
      </Button>
    </BaseModal>
  );
};

export default DisputeVendor;
