import React, { useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { Box, Flex, Text } from "@chakra-ui/react";
import DocumentUpload from "../../builder/components/DocumentUpload";
// import CreateProjectFundManager from "./CreateProjectFundManager";

export default function SupportVendor({
  isOpen: supportIsOpen,
  onClose: onCloseSupport,
  vendor,
  setHideSupport,
  hideSupport,
  refetch,
}) {
  const [onDocUpload, setOnDocUpload] = useState(false);

  return (
    <>
      {!hideSupport && (
        <BaseModal
          isOpen={supportIsOpen}
          onClose={() => setHideSupport(true)}
          title="Support"
          subtitle={vendor?.businessName}
        >
          <Box pt="16px" pb="61px">
            <Text align="center" mb="32px" fontSize="20px" fontWeight="500">
              How do you want to support this customer today?
            </Text>
            <Flex justify="center" gap="16px" wrap="wrap">
              <Box
                as="button"
                bgColor="secondary"
                color="#fff"
                p="5px 13px"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => (setOnDocUpload(true), setHideSupport(true))}
              >
                Upload Profile Document
              </Box>
            </Flex>
          </Box>
        </BaseModal>
      )}

      <BaseModal
        isOpen={onDocUpload}
        onClose={() => setOnDocUpload(false)}
        title="Business Documents"
        subtitle="Add a vendor’s business documents."
        size="xl"
      >
        <DocumentUpload
          onclose={() => setOnDocUpload(false)}
          useId={vendor?.id}
          userType="Vendor"
        />
      </BaseModal>
    </>
  );
}
