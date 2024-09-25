import React, { useEffect, useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { Box, Flex, Text } from "@chakra-ui/react";
import CreateProjectBuilder from "./createProject";
import MaterialScheduleUpload from "./MaterialScheduleUpload";
import CreateRfq from "./createRfq";
import instance from "../../../../utility/webservices";
import DocumentUpload from "./DocumentUpload";

export default function SupportBuilder({
  isOpen: supportIsOpen,
  onClose: onCloseSupport,
  builder = null,
  setHideSupport,
  hideSupport,
  refetch,
}) {
  const [onCreateProject, setOnCreateProject] = useState(false);
  const [onCreateMaterialUpload, setOnCreateMaterialUpload] = useState(false);
  const [onCreateRfq, setOnCreateRfq] = useState(false);
  const [onDocUpload, setOnDocUpload] = useState(false);
  const [projectOpt, setProjectOpt] = useState([]);
  const [builderProjects, setBuilderProjects] = useState(null);
  const [projectIsLoading, setProjectIsLoading] = useState(false);

  const getBuilderProjects = async () => {
    setProjectIsLoading(true);
    try {
      const { data } = await instance.get(
        `/superAdmin/projects/builders/${builder?.id}`
      );
      setBuilderProjects(data);
    } catch (error) {
      console.log(error);
    } finally {
      setProjectIsLoading(false);
    }
  };
  useEffect(() => {
    if (builder && supportIsOpen) {
      getBuilderProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder, supportIsOpen]);

  useEffect(() => {
    if (builderProjects) {
      const projectOptions = builderProjects?.data?.businessProjects.map(
        (el) => {
          return {
            value: el.id,
            label: el.title,
          };
        }
      );
      setProjectOpt(projectOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIsLoading]);

  return (
    <>
      {!hideSupport && (
        <BaseModal
          isOpen={supportIsOpen}
          onClose={() => setHideSupport(true)}
          title="Support"
          subtitle={builder?.businessName}
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
                onClick={() => (setOnCreateRfq(true), setHideSupport(true))}
              >
                Create RFQ
              </Box>
              <Box
                as="button"
                bgColor="secondary"
                color="#fff"
                p="5px 13px"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => (
                  setOnCreateMaterialUpload(true), setHideSupport(true)
                )}
              >
                Upload Material Schedule
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
      <CreateProjectBuilder
        isOpen={onCreateProject}
        onClose={setOnCreateProject}
        builderId={builder?.id}
        refetch={refetch}
      />
      <MaterialScheduleUpload
        builderId={builder?.id}
        isOpen={onCreateMaterialUpload}
        onClose={setOnCreateMaterialUpload}
        refetch={refetch}
        projectOpt={projectOpt}
      />

      {/* Create RFQ Modal */}
      <BaseModal
        isOpen={onCreateRfq}
        onClose={() => setOnCreateRfq(false)}
        title="Request For Quote"
        subtitle="Create an RFQ for your project"
        size="xl"
      >
        <CreateRfq
          onclose={() => setOnCreateRfq(false)}
          builderId={builder?.id}
          projectOpt={projectOpt}
        />
      </BaseModal>

      <BaseModal
        isOpen={onDocUpload}
        onClose={() => setOnDocUpload(false)}
        title="Business Documents"
        subtitle="Add a builder’s business documents."
        size="xl"
      >
        <DocumentUpload
          onclose={() => setOnDocUpload(false)}
          useId={builder?.id}
          userType="Builder"
        />
      </BaseModal>
    </>
  );
}
