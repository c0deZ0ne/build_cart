import { Box, Flex, FormLabel, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Button from "../../../../components/Button";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Input, { InputPhone } from "../../../../components/Input";
import BaseModal from "../../../../components/Modals/Modal";
import SuccessMessage from "../../../../components/SuccessMessage";
import {
  useAddMemberToTeamMutation,
  useEditTeamMemberDetailsMutation,
} from "../../../../redux/api/super-admin/superAdminSlice";
import { userData } from "../../../../redux/store/store";

/**
 *
 * @param {{
 *  action: 'add' | 'edit',
 *  refetch: () => void,
 *  onClose: () => void,
 *  isOpen: boolean
 *  teamMember?: object
 * }} props
 * @returns
 */
export default function AddTeamMemberForm({
  action,
  refetch,
  isOpen,
  onClose,
  teamMember,
}) {
  const userInfo = useSelector(userData);

  const [
    addFn,
    {
      isLoading: isAdding,
      error: addError,
      isError: addFailed,
      isSuccess: addSuccess,
    },
  ] = useAddMemberToTeamMutation();

  const [
    editFn,
    {
      isLoading: isEditting,
      error: editError,
      isError: editFailed,
      isSuccess: editSuccess,
    },
  ] = useEditTeamMemberDetailsMutation();

  const toast = useToast();

  const addTeamMemberSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email(),
    phoneNumber: yup.string().required("Phone is required"),
    role: yup.object().required("Role is required"),
  });

  const roleOptions = [
    { label: "Admin", value: "ADMIN" },
    { label: "Customer support", value: "CUSTOMER_SUPPORT" },
    { label: "Procurement Manager", value: "PROCUREMENT_MANAGER" },
  ];
  const methods = useForm({
    defaultValues: {
      name: teamMember ? teamMember.user.name : "",
      phoneNumber: teamMember ? teamMember.user.phoneNumber : "",
      email: teamMember ? teamMember.user.email : "",
      role: teamMember ? teamMember.user.role : "",
    },
    resolver: yupResolver(addTeamMemberSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (addSuccess) {
      toast({
        status: "success",
        description: "Team member added",
      });
      refetch();
    }

    if (addFailed && addError) {
      toast({
        status: "error",
        description: addError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addError, addFailed, addSuccess]);

  useEffect(() => {
    if (editSuccess) {
      toast({
        status: "success",
        description: "Member details editted!",
      });
      refetch();
    }

    if (editFailed && editError) {
      toast({
        status: "error",
        description: editError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSuccess, editError, editFailed]);

  const onSubmit = (data) => {
    const dataToSubmit = { ...data, role: data.role.value };
    console.log(dataToSubmit);

    const teamId = userInfo.data.teams[0].id;

    if (action === "add") {
      addFn(dataToSubmit);
    }
    if (action === "edit") {
      const memberId = teamMember.user.id;
      delete dataToSubmit.email;
      editFn({
        teamId: teamId,
        teamMemberUserId: memberId,
        data: dataToSubmit,
      });
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        title={action === "add" ? "Add Team member" : "Edit"}
        subtitle={
          action === "add"
            ? "Create a new team member"
            : "Modify an existing team member"
        }
        showHeader={!addSuccess}
      >
        {addSuccess || editSuccess ? (
          <SuccessMessage
            message={
              action === "add"
                ? "Team member added successfully."
                : "Edit successful"
            }
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="John Jameson"
                      label="Name"
                      value={value}
                      onChange={onChange}
                    />
                    <div style={{ color: "red" }}>
                      {errors["name"] ? errors["name"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="mail@mail.com"
                      label="Email"
                      value={value}
                      onChange={onChange}
                      isDisabled={action === "edit"}
                    />
                    <div style={{ color: "red" }}>
                      {errors["email"] ? errors["email"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb="24px">
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Flex direction="column">
                      <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                        Phone Number <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <InputPhone
                        name="phone"
                        value={value}
                        onChange={onChange}
                      />
                    </Flex>
                    <div style={{ color: "red" }}>
                      {errors["phoneNumber"]
                        ? errors["phoneNumber"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb={"40px"}>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <FormLabel
                      mb="0"
                      textTransform="capitalize"
                      fontWeight="400"
                      fontSize="14px"
                    >
                      User role
                      <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <CustomSelect
                      placeholder="Role"
                      options={roleOptions}
                      value={value}
                      onChange={onChange}
                    />
                    <div style={{ color: "red", fontSize: "14px" }}>
                      {errors["role"] ? errors["role"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Button full isSubmit isLoading={isAdding || isEditting}>
              {action === "add" ? "Add" : "Update information"}
            </Button>
          </form>
        )}
      </BaseModal>
    </>
  );
}
