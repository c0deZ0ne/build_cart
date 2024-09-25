import { Box, useDisclosure } from "@chakra-ui/react";
import React from "react";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import BusinessDocs from "./businessDocs";

const BusinessInfo = ({ data, isOpen, onOpen, onClose }) => {
  const {
    isOpen: isOpenDocs,
    onOpen: onOpenDocs,
    onClose: onCloseDocs,
  } = useDisclosure();

  return (
    <div>
      <Box fontSize="14px" mb="40px">
        <Box my={"10px"} w={"100%"}>
          <Input
            placeholder="1,000,000,000"
            value={"value"}
            label="Business Address"
            isRequired
            isDisabled
            disabled
          />
        </Box>
        <Box my={"10px"} w={"100%"}>
          <Input
            placeholder="1,000,000,000"
            value={"value"}
            label="Business Registration Number"
            isRequired
            isDisabled
            disabled
          />
        </Box>
        <Box my={"10px"} w={"100%"}>
          <Input
            placeholder="1,000,000,000"
            value={"value"}
            label="Business Size"
            isRequired
            isDisabled
            disabled
          />
        </Box>
      </Box>

      <Button mb={10} full onClick={onOpenDocs} mr={3}>
        Next
      </Button>

      <BusinessDocs
        data={data}
        isOpen={isOpenDocs}
        onOpen={onOpenDocs}
        onClose={onCloseDocs}
      />
    </div>
  );
};

export default BusinessInfo;
