import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import BaseModal from "../../../../../components/Modals/Modal";
import Button from "../../../../../components/Button";
import useModalHandler from "../../../../../components/Modals/SuccessModal";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TruncateText from "../../../../../components/Truncate";

const BusinessDocs = ({ data, isOpen, onOpen, onClose }) => {
  const [borderColor, setBorderColor] = useState("#999999");
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const docs = [
    { label: "certificateOfIncorporation", name: "Certificate of Inc." },
    { label: "contactId", name: "Contact ID" },
    { label: "utilityBill", name: "Utility Bill" },
    { label: "other", name: "Other Document" },
  ];

  function initiateDownload(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = url;
    link.target = "_blank";
    link.click();
  }

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={"Business Documents"}
        subtitle={"Verify customer's business documents."}
      >
        <Box fontSize="14px" mb="40px">
          {docs.map((e, i) => (
            <Box my={"10px"} w={"100%"} key={i}>
              <Text
                as="label"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: `1px solid ${borderColor}`,
                  padding: "11px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                }}
                _hover={{ background: "#F5862E29" }}
                htmlFor="uploadfiles"
                onMouseEnter={() => setBorderColor("#F5862E")}
                onMouseLeave={() => setBorderColor("#999999")}
                onClick={() => initiateDownload("file?.src")}
              >
                <Text fontSize="16px" color="#677287">
                  {e?.name}
                </Text>
                <Flex align="center" gap={2}>
                  <Box color="info" textAlign="right">
                    <TruncateText innerWidth="200px">
                      {e?.label}.png
                    </TruncateText>
                  </Box>

                  <FaCloudDownloadAlt fill="#999999" fontSize="1.2em" />
                </Flex>
              </Text>
            </Box>
          ))}
        </Box>

        <VStack gap={4}>
          <Button
            mb={10}
            full
            //   isLoading={isLoadingSubmit}
            //   onClick={handleSubmit(onSubmit)}
            mr={3}
          >
            Approve Id
          </Button>
          <Button
            mb={10}
            full
            //   isLoading={isLoadingSubmit}
            //   onClick={handleSubmit(onSubmit)}
            mr={3}
          >
            Request further documents
          </Button>
        </VStack>
      </BaseModal>
    </div>
  );
};

export default BusinessDocs;
