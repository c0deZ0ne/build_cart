import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Button from "../../../../../components/Button";
import Input, { TextArea } from "../../../../../components/Input";
import { FaCloudUploadAlt } from "react-icons/fa";
import BaseModal from "../../../../../components/Modals/Modal";

const DisputeReason = ({ data, isOpen, onClose, setNext }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Dispute"
      subtitle="Open a dispute resolution"
    >
      <Box fontSize="14px" mb="40px">
        <Box mt={"10px"} mb="16px" w={"100%"}>
          <Input
            placeholder="Dispute"
            value={data?.reason}
            label="Dispute Reason"
            isRequired
            isDisabled
            disabled
          />
        </Box>
        <Box w={"100%"} mb="16px">
          <TextArea value={data?.message} placeholder="Message" isDisabled />
        </Box>
        <Box mb="16px" w={"100%"}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            borderRadius="8px"
            border="1px solid #999999"
            padding="11px 16px"
            textAlign="center"
            cursor="pointer"
            fontSize="14px"
            width="100%"
          >
            <Text fontSize="16px" color="#677287">
              Click to attach file (API doesn't return link to file)
            </Text>
            <Flex align="center" gap={2}>
              <a href={data?.link || "#"} target="_blank" rel="noreferrer">
                <FaCloudUploadAlt fill="#1C903D" fontSize="1.2em" />
              </a>

              <input
                type="file"
                name="upload"
                id="uploadfiles"
                disabled
                hidden
              />
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Button mb={10} full onClick={() => setNext(true)} mr={3}>
        Contact seller and buyer
      </Button>
    </BaseModal>
  );
};

export default DisputeReason;
