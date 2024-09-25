import React, { useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { Box, Flex, Text } from "@chakra-ui/react";
import CreateProjectFundManager from "./CreateProjectFundManager";
import DocumentUpload from "../../builder/components/DocumentUpload";

export default function SupportFundManager({
  isOpen: supportIsOpen,
  onClose: onCloseSupport,
  fundManager,
  setHideSupport,
  hideSupport,
}) {
  const [onCreateProject, setOnCreateProject] = useState(false);
  const [onDocUpload, setOnDocUpload] = useState(false);

  return (
    <>
      {!hideSupport && (
        <BaseModal
          isOpen={supportIsOpen}
          onClose={() => setHideSupport(true)}
          title="Support"
          subtitle={fundManager?.businessName}
        >
          <Box pt="16px" pb="61px">
            <Text align="center" mb="32px" fontSize="20px" fontWeight="500">
              How do you want to support this customer today?
            </Text>
            <Flex justify="center" gap="16px">
              <Box
                as="button"
                bgColor="secondary"
                color="#fff"
                p="5px 13px"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => (setOnCreateProject(true), setHideSupport(true))}
              >
                Create Project
              </Box>
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

      <CreateProjectFundManager
        isOpen={onCreateProject}
        onClose={setOnCreateProject}
        fundManagerId={fundManager?.id}
      />

      <BaseModal
        isOpen={onDocUpload}
        onClose={() => setOnDocUpload(false)}
        title="Business Documents"
        subtitle="Add a builder’s business documents."
        size="xl"
      >
        <DocumentUpload
          onclose={() => setOnDocUpload(false)}
          useId={fundManager?.id}
          userType="Fund manager"
        />
      </BaseModal>
    </>
  );
}
