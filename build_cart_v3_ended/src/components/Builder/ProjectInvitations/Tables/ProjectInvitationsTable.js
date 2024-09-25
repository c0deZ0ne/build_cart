import {
  Box,
  Button as ChakraButton,
  Flex,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import {
  useDeleteProjectInvitationsMutation,
  useGetAllProjectInvitationsQuery,
} from "../../../../redux/api/builder/builder";
import UserOctagon from "../../../Icons/UserOctagon";
import BaseTable from "../../../Table";
import ProjectTenderModal from "../ProjectTenderModal";

const ProjectInvitationsTable = ({ setInviteNum }) => {
  const toast = useToast();
  const [openTenderModal, setOpenTenderModal] = useState(!true);
  // const [openInvitationModal, setOpenInvitationModal] = useState(!true);
  const [currentInvite, setCurrentInvite] = useState(null);
  const tableColumns = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "FUND MANAGER",
    "PROJECT NAME",
    "TYPE",
    "LOCATION",
    "START DATE",
    "ACTION",
  ];

  const { data, refetch, isLoading } = useGetAllProjectInvitationsQuery();
  const [deleteFn, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteProjectInvitationsMutation();

  async function deleteInvite(e, tenderId) {
    e.stopPropagation();
    await deleteFn(tenderId);
  }

  function viewTenderModal(e, d) {
    e.stopPropagation();

    setCurrentInvite(d);
    setOpenTenderModal(true);
  }

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        status: "warning",
        description: "Invite removed",
      });
    }
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSuccess]);

  useEffect(() => {
    if (!data) return;

    setInviteNum(data.data.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.data.map((d) => {
      const { projectName, fundManagerLogo, type, location, startDate } = d;
      return {
        IMAGE: (
          <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
            <Image src={fundManagerLogo} />{" "}
          </Box>
        ),
        "FUND MANAGER": fundManagerLogo,
        "PROJECT NAME": projectName,
        TYPE: capitalize(type),
        LOCATION: location,
        "START DATE": startDate.split("T")[0],
        ACTION: (
          <Flex ml={"-24px"} gap={"16px"}>
            <ChakraButton
              isLoading={isDeleting || isLoading}
              size="sm"
              fontSize="14px"
              background="#D5E7D9"
              color="#1C903D"
              onClick={(e) => viewTenderModal(e, d)}
              px={"24px"}
              py="6px"
              _hover={{ color: "#D5E7D9", background: "#1C903D" }}
            >
              Tender
            </ChakraButton>
            <ChakraButton
              isLoading={isDeleting || isLoading}
              size="sm"
              fontSize="14px"
              color="#C43C25"
              background="#EFD9D5"
              onClick={(e) => deleteInvite(e, d.ProjectTenderId)}
              px={"24px"}
              py="6px"
              _hover={{ color: "#EFD9D5", background: "#c43c25" }}
            >
              Remove
            </ChakraButton>
          </Flex>
        ),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isDeleting, isLoading]);

  return tableData.length ? (
    <>
      {currentInvite && (
        <ProjectTenderModal
          onClose={() => setOpenTenderModal(false)}
          closeModal={() => setOpenTenderModal(false)}
          invite={currentInvite}
          isOpen={openTenderModal}
          projectId={currentInvite.projectId}
          projectTenderId={currentInvite.ProjectTenderId}
          key={openTenderModal}
        />
      )}

      <BaseTable
        pointerCursor={true}
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading}
      />
    </>
  ) : (
    <Box>
      <EmptyState>
        <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
          You do not have any{" "}
          <Text as="span" color="#12355A">
            project invitations{" "}
          </Text>
          at the moment.{" "}
          <Text as="span" color="secondary">
            All project invites
          </Text>{" "}
          sent to your Cutstruct account by a financier will be displayed here.
        </Text>
      </EmptyState>
    </Box>
  );
};

export default ProjectInvitationsTable;
