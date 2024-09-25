import {
  Box,
  Button as ChakraButton,
  Flex,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo } from "react";
import { FaPlay } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import StatusPill from "../../../../components/Builder/ProjectInvitations/StatusPill";
import EmptyState from "../../../../components/EmptyState";
import DeleteIcon from "../../../../components/Icons/Delete";
import Pause from "../../../../components/Icons/Pause";
import UserOctagon from "../../../../components/Icons/UserOctagon";
import DialogModal from "../../../../components/Modals/Dialog";
import BaseTable from "../../../../components/Table";
import {
  useDeleteTeamMemberMutation,
  usePauseOrUnpauseMutation,
} from "../../../../redux/api/super-admin/superAdminSlice";
import AddTeamMemberForm from "./addTeamMemberForm";

const tableColumn = [
  { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
  "NAME",
  "EMAIL",
  "ROLE",
  "STATUS",
  "ACTION",
];

/**
 *
 * @param {{teamId: string, teamMember: object, refetch: () => void, isLoading: boolean}} props
 * @returns
 */
const Actions = ({ teamId, teamMember, refetch, isLoading }) => {
  const isActive = teamMember.user.status === "ACTIVE";
  const messages = {
    toggleDialogModalTitle: `${isActive ? "Pause" : "Activate"} Team member`,
    toggleDialogModalMessage: `Are you sure you want to ${
      isActive ? "pause" : "activate"
    } this member`,
    toggleDialogModalSuccessMessage: `${teamMember.user.name} has been ${
      isActive ? "paused" : "activated"
    } successfully`,
    deleteDialogTitle: `Remove Team member`,
    deleteDialogMessage: `Remove ${teamMember.user.name} from team ?`,
    deleteDialogSuccessMessage: `${teamMember.user.name} has been removed from team.`,
  };

  const toast = useToast();
  const [
    togglePauseFn,
    {
      isLoading: isToggling,
      isSuccess: togglePauseSuccess,
      isError: togglePauseFailed,
      error: togglePauseError,
    },
  ] = usePauseOrUnpauseMutation();

  const [
    deleteFn,
    {
      isLoading: isDeleting,
      isSuccess: deleteSuccess,
      isError: deleteFailed,
      error: deleteError,
    },
  ] = useDeleteTeamMemberMutation();

  const {
    isOpen: toggleDialogIsOpen,
    onClose: onCloseToggleDialog,
    onOpen: onOpenToggleDialog,
  } = useDisclosure();

  const {
    isOpen: deleteDialogIsOpen,
    onClose: onCloseDeleteDialog,
    onOpen: onOpenDeleteDialog,
  } = useDisclosure();

  const {
    isOpen: editFormIsOpen,
    onOpen: onOpenEditForm,
    onClose: onCloseEditForm,
  } = useDisclosure();

  useEffect(() => {
    if (togglePauseSuccess) {
      toast({
        status: "success",
        description: messages.toggleDialogModalSuccessMessage,
      });
      onOpenToggleDialog();
    }

    if (togglePauseFailed && togglePauseError) {
      toast({
        status: "error",
        description: togglePauseError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePauseError, togglePauseFailed, togglePauseSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        status: "success",
        description: messages.deleteDialogSuccessMessage,
      });
    }
    if (deleteFailed && deleteError) {
      toast({
        status: "error",
        description: deleteError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteError, deleteFailed, deleteSuccess]);

  function togglePause() {
    const memberId = teamMember.user.id;
    const status = isActive ? "PAUSED" : "ACTIVE";
    togglePauseFn({
      teamId: teamId,
      teamMemberUserId: memberId,
      status: status,
    });
  }

  function deleteMember() {
    const memberId = teamMember.user.id;
    deleteFn({ teamId: teamId, teamMemberUserId: memberId });
  }

  return (
    <Box>
      <Flex ml={"-24px"} gap={"1rem"} align={"center"} color={"#565759"}>
        <ChakraButton
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditForm();
          }}
          color={"currentcolor"}
          _hover={{ color: "#FFBD00" }}
        >
          <RiEdit2Fill fill="currentColor" color="currentColor" />
        </ChakraButton>
        <ChakraButton
          variant={"ghost"}
          p={0}
          onClick={(e) => {
            e.stopPropagation();
            onOpenToggleDialog();
          }}
          color={"currentcolor"}
          _hover={{ color: "#FFBD00" }}
        >
          {isToggling ? (
            <React.Fragment>
              <Spinner />
            </React.Fragment>
          ) : isActive ? (
            <Pause fill="currentColor" color="currentColor" />
          ) : (
            <FaPlay fill="currentColor" color="currentColor" />
          )}
        </ChakraButton>
        <ChakraButton
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDeleteDialog();
          }}
          color={"currentcolor"}
          _hover={{ color: "#EE4124" }}
        >
          <DeleteIcon fill="currentColor" color="currentColor" />
        </ChakraButton>
      </Flex>

      {toggleDialogIsOpen && (
        <DialogModal
          isOpen={true}
          onClose={() => {
            onCloseToggleDialog();
            if (togglePauseSuccess) {
              refetch();
            }
          }}
          onNo={onCloseToggleDialog}
          onYes={togglePause}
          isLoading={isToggling}
          title={messages.toggleDialogModalTitle}
          message={messages.toggleDialogModalMessage}
          successMessage=""
          showSuccessMessage={togglePauseSuccess}
        ></DialogModal>
      )}

      {deleteDialogIsOpen && (
        <DialogModal
          isOpen={true}
          onClose={() => {
            onCloseDeleteDialog();

            if (deleteSuccess) {
              refetch();
            }
          }}
          onNo={onCloseDeleteDialog}
          onYes={deleteMember}
          isLoading={isDeleting}
          title={messages.deleteDialogTitle}
          message={messages.deleteDialogMessage}
          successMessage={messages.deleteDialogSuccessMessage}
          showSuccessMessage={deleteSuccess}
        />
      )}

      {editFormIsOpen && (
        <AddTeamMemberForm
          action="edit"
          isOpen={editFormIsOpen}
          teamMember={teamMember}
          onClose={onCloseEditForm}
          refetch={refetch}
          key={editFormIsOpen}
        />
      )}
    </Box>
  );
};

const TeamMembersListTable = ({ teamId, teamMembers, refetch, isLoading }) => {
  const tableData = useMemo(() => {
    return teamMembers.map((member) => {
      const { user } = member;

      const { name, email, roles, status } = user;

      const rolesJoin = roles
        .map((role) => role.name.split("_").join(" "))
        .join(", ");

      const color = (status) => {
        const map = {
          ACTIVE: "#1C903D",
          PENDING: "#FFBD00",
          PAUSED: "#FFBD00",
          DEFAULT: "#000000",
        };

        return map[status] || map.DEFAULT;
      };

      return {
        "": "",
        NAME: name,
        EMAIL: email,
        ROLE: rolesJoin,
        STATUS: (
          <StatusPill color={color(status)} status={capitalize(status)} />
        ),
        ACTION: (
          <Actions teamId={teamId} teamMember={member} refetch={refetch} />
        ),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMembers]);

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableData}
        isLoading={isLoading}
        empty={
          <EmptyState>
            <Text>
              There are no{" "}
              <Text as="span" color="#F5852C">
                Team members
              </Text>{" "}
              on the platform.
            </Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default TeamMembersListTable;
