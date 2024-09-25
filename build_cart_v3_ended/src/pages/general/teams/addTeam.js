import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEnvelope, FaUser } from "react-icons/fa";
import instance from "../../../utility/webservices";
import { handleError } from "../../../utility/helpers";
import Input, { InputPhone } from "../../../components/Input";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import BaseModal from "../../../components/Modals/Modal";
import Button from "../../../components/Button";
import useModalHandler from "../../../components/Modals/SuccessModal";

const AddTeam = ({
  isOpen,
  onClose,
  isEdit,
  member,
  getTeamMembers,
  teamId,
}) => {
  // const user = JSON.parse(localStorage.getItem("userInfo"));
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const [isLoading, setLoading] = useState(false);
  const roles = [
    { label: "Admin", value: "ADMIN" },
    { label: "Accountant", value: "ACCOUNTANT" },
    { label: "Procurement Manager", value: "PROCUREMENT MANAGER" },
  ];

  const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email(),
    phoneNumber: yup.string().required("Phone Number is required"),
    role: yup.object().required("Role is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  if (isEdit) {
    setValue("name", member?.name);
    setValue("email", member?.email);
    setValue("phoneNumber", member?.phoneNumber);
    const memberRole = roles.find((e) => e?.value === member.roles[0]?.name);
    setValue("role", memberRole);
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      role: data?.role?.value,
    };

    try {
      isEdit
        ? await instance.patch(`/team/${member?.id}/${teamId}`, payload)
        : await instance.post("/team", payload);

      handleSuccessModal(
        isEdit
          ? "You have successfully edit a team member"
          : `You have successfully added ${payload.name} to your team`
      );
      onClose();
      reset();
      getTeamMembers(teamId);
      return setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEdit ? "Edit" : "Add Team member"}
        subtitle={
          isEdit ? "Modify an existing team member" : "Create a new team member"
        }
        reset={reset}
      >
        <Box fontSize="14px" mb="20px">
          <Box my={"10px"}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="John Jameson"
                    label="Name"
                    isRequired
                    value={value}
                    onChange={onChange}
                    leftIcon={<FaUser />}
                  />
                  <div style={{ color: "red" }}>
                    {errors["name"] ? errors["name"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my={"10px"}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="j.jameson@cutstruct.com"
                    label="Email"
                    isRequired
                    isDisabled={isEdit && true}
                    value={value}
                    onChange={onChange}
                    leftIcon={<FaEnvelope />}
                  />
                  <div style={{ color: "red" }}>
                    {errors["email"] ? errors["email"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my={"10px"}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputPhone
                  value={value}
                  label={"Phone Number"}
                  onChange={onChange}
                  isRequired
                />
              )}
            />
            <div style={{ color: "red" }}>
              {errors["phoneNumber"] ? errors["phoneNumber"]?.message : ""}
            </div>
          </Box>
          <Box my={"10px"}>
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <CustomSelect
                    value={value}
                    label="User Role"
                    onChange={onChange}
                    options={roles}
                    isRequired
                    placeholder="Select user role"
                  />
                  <div style={{ color: "red" }}>
                    {errors["role"] ? errors["role"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Button
          mb={10}
          isLoading={isLoading}
          full
          onClick={handleSubmit(onSubmit)}
          mr={3}
        >
          {isEdit ? "Edit" : "Add"}
        </Button>
      </BaseModal>

      {/* Render the modal component */}
      {ModalComponent}
    </div>
  );
};

export default AddTeam;
