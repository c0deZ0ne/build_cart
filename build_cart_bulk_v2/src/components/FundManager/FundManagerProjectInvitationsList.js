import {
  Box,
  Button as ChakraButton,
  Flex,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useAcceptProjectInviteMutation,
  useDeclineProjectInviteMutation,
  useGetProjectsInvitesSharedWithMeQuery,
} from "../../redux/api/builder/projectSlice";
import Button from "../Button";
import EmptyState from "../EmptyState";
import Dialog from "../Modals/Dialog";
import BaseModal from "../Modals/Modal";
import SuccessMessage from "../SuccessMessage";
import BaseTable from "../Table";

const tableColumns = [
  "S/N",
  "NAME",
  "PROJECT TITLE",
  "DESCRIPTION",
  "LOCATION",
  "PROJECT DURATION",
  "DATE CREATED",
  "ACTION",
];

const ProjectGroupSelection = ({ onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const formSchema = yup.object({
    group: yup.string().required("Project group is required"),
  });

  const groupOptions = [
    { label: "Project Group 1", value: "Project Group 1" },
    { label: "Project Group 2", value: "Project Group 2" },
    { label: "Project Group 3", value: "Project Group 3" },
    { label: "Project Group 4", value: "Project Group 4" },
    { label: "Project Group 5", value: "Project Group 5" },
  ];

  const methods = useForm({
    defaultValues: {
      group: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit = (data) => {
    console.log({ data });

    setIsSuccess(true);
  };

  return (
    <BaseModal
      showHeader={!isSuccess}
      isOpen={true}
      onClose={onClose}
      title="Project Group Selection"
      subtitle="Select the project group you want to add this project to "
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Project Groups{" "}
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="group"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Select
                    height={"56px"}
                    value={value}
                    onChange={onChange}
                    placeholder="Project Group"
                  >
                    {groupOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <div style={{ color: "red" }}>
                    {errors["group"] ? errors["group"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          <Box mt={"40px"}>
            <Button full isSubmit>
              Save
            </Button>
          </Box>
        </form>
      ) : (
        <SuccessMessage
          message="Project has been successfully added 
      to the Project Name 1 group"
        />
      )}
    </BaseModal>
  );
};

/**
 *
 * @param {{shareId: string, refetchInvites: () => void}} props
 * @returns
 */
const Actions = ({ sharedId, refetchInvites }) => {
  const toast = useToast();
  const [openGroupModal, setOpenGroupModal] = useState(!!0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openRejectMessage, setOpenRejectMessage] = useState(!!0);
  const [openAcceptMessage, setOpenAcceptMessage] = useState(false);

  const [
    declineFn,
    {
      isLoading: isDeclining,
      isError: declineFailed,
      error: declineError,
      isSuccess: declineSuccess,
      data: declineData,
    },
  ] = useDeclineProjectInviteMutation();

  const [
    acceptFn,
    {
      isLoading: isAccepting,
      isError: acceptFailed,
      error: acceptError,
      isSuccess: acceptSuccess,
      data: acceptData,
    },
  ] = useAcceptProjectInviteMutation();

  useEffect(() => {
    if (acceptFailed && acceptError) {
      toast({
        status: "error",
        description: acceptError.data.message,
      });
    }

    if (acceptSuccess) {
      toast({
        status: "success",
        description: acceptData.data.message,
      });
      setOpenAcceptDialog(false);
      setOpenAcceptMessage(true);
    }

    if (declineFailed && declineError) {
      toast({
        status: "error",
        description: declineError.data.message,
      });
    }

    if (declineSuccess) {
      toast({
        status: "success",
        description: declineData.data.message,
      });
      setOpenRejectDialog(false);
      setOpenRejectMessage(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    acceptData,
    acceptError,
    acceptFailed,
    acceptSuccess,
    declineData,
    declineError,
    declineFailed,
    declineSuccess,
  ]);

  return (
    <Flex ml={"-24px"} gap={"16px"}>
      <ChakraButton
        size="sm"
        fontSize="14px"
        background="#D5E7D9"
        color="#1C903D"
        onClick={() => setOpenAcceptDialog(true)}
        px={"24px"}
        py="6px"
        _hover={{ color: "#D5E7D9", background: "#1C903D" }}
        isLoading={isDeclining || isAccepting}
      >
        Accept
      </ChakraButton>
      <ChakraButton
        size="sm"
        fontSize="14px"
        color="#C43C25"
        background="#EFD9D5"
        onClick={() => setOpenRejectDialog(true)}
        px={"24px"}
        py="6px"
        _hover={{ color: "#EFD9D5", background: "#c43c25" }}
        isLoading={isDeclining || isAccepting}
      >
        Reject
      </ChakraButton>

      <Dialog
        buttonType="basic"
        title="Add project to group"
        isOpen={openDialog}
        onYes={() => {
          setOpenGroupModal(true);
          setOpenDialog(false);
        }}
        onNo={() => {
          setOpenDialog(false);
        }}
        message="Do you want to add this project to a group?"
        onClose={() => setOpenDialog(false)}
      />

      {openGroupModal && (
        <ProjectGroupSelection onClose={() => setOpenGroupModal(false)} />
      )}

      {openRejectDialog && (
        <Dialog
          isLoading={isDeclining}
          yesText="Yes, Decline"
          noText="No, Cancel"
          isOpen={true}
          onClose={() => setOpenRejectDialog(false)}
          message="Are you sure you want to decline this invite?"
          title="Decline Invite"
          onNo={() => setOpenRejectDialog(false)}
          onYes={() => declineFn(sharedId)}
        />
      )}

      {openAcceptDialog && (
        <Dialog
          isLoading={isAccepting}
          yesText="Yes, Accept"
          noText="No, Cancel"
          isOpen={true}
          onClose={() => setOpenAcceptDialog(false)}
          message="Do you want tot accept this invite?"
          title="Accept invite"
          onNo={() => setOpenAcceptDialog(false)}
          onYes={() => acceptFn(sharedId)}
        />
      )}

      {openRejectMessage && (
        <BaseModal
          isOpen={openRejectMessage}
          onClose={() => {
            setOpenRejectMessage(false);
            refetchInvites();
          }}
          showHeader={false}
        >
          <SuccessMessage message="Builder has been notified of the decline." />
        </BaseModal>
      )}

      {openAcceptMessage && (
        <BaseModal
          isOpen={openAcceptMessage}
          onClose={() => {
            setOpenAcceptMessage(false);
            refetchInvites();
          }}
          showHeader={false}
        >
          <SuccessMessage message="Invited Accepted!" />
        </BaseModal>
      )}
    </Flex>
  );
};

/**
 *
 * @param {{setInviteCount: (num: number) => void}} param0
 * @returns
 */
const FundManagerProjectInvitationsList = ({ setInviteCount }) => {
  const { data, isLoading, refetch } = useGetProjectsInvitesSharedWithMeQuery();

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const mapped = data.data.map((d, index) => {
      const SN = index < 9 ? `0${index + 1}` : `${index + 1}`;

      const {
        title,
        location,
        dateCreated,
        duration,
        owner: { name },
        sharedId,
      } = d;
      return {
        "S/N": SN,
        NAME: name,
        "PROJECT TITLE": title,
        DESCRIPTION: "-", // TODO: Add description
        LOCATION: location,
        "PROJECT DURATION": duration,
        "DATE CREATED": dateCreated.split("T")[0],
        ACTION: <Actions sharedId={sharedId} refetchInvites={refetch} />,
      };
    });

    return mapped;
  }, [data]);

  useEffect(() => {
    setInviteCount(tableData.length);
  }, [tableData]);

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading}
        empty={
          <EmptyState>
            <Text>
              You do not have any{" "}
              <Text color={"primary"} as={"span"}>
                project invitations
              </Text>{" "}
              at the moment.
              <Text color={"secondary"} as={"span"}>
                {" "}
                All project invites{" "}
              </Text>
              you send will be displayed here.
            </Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default FundManagerProjectInvitationsList;
