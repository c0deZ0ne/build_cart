import { Box, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useSendInviteToFundManagerMutation } from "../../../redux/api/builder/builder";
import { userData } from "../../../redux/store/store";
import Button from "../../Button";
import Input, { InputPhone, TextArea } from "../../Input";
import BaseModal from "../../Modals/Modal";
import SelectSearch from "../../SelectSearch";

/**
 *
 * @param {{isOpen: Boolean, closeModal: Function, projects: {name: string, id: string}[]}} props
 * @returns
 */
const InviteFundManagerFormModal = ({ isOpen, closeModal, projects }) => {
  const userInfo = useSelector(userData);

  const [sendInviteToFundManager, { isLoading, isSuccess, error, isError }] =
    useSendInviteToFundManagerMutation();

  const [project, setProject] = useState("");

  const formSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Input must be a valid email"),
    phone: yup.string().required("Phone number is required"),
    message: yup.string().required("Message is required"),
    project: yup.string(),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project: "",
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
    const formData = {
      toName: data.name,
      toEmail: data.email,
      phoneNumber: data.phone,
      Location: "Lagos",
      projectId: data.project,
      message: data.message,
      inviteeName: userInfo.data.userName,
    };

    if (!formData.projectId) {
      delete formData.projectId;
    }

    sendInviteToFundManager(formData);
  };

  const toast = useToast();

  useEffect(() => {
    if (!isSuccess) return;
    toast({
      description: "Invite sent!",
      status: "success",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <BaseModal
      onClose={closeModal}
      isOpen={isOpen}
      title="Invite Fund Manager"
      subtitle="The copy here would explain what the supplier would be doing"
      showHeader={!isSuccess}
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box my="0">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Name{" "}
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Input
                    type={"text"}
                    value={value}
                    onChange={onChange}
                    placeholder="John Jameson"
                    leftIcon={<FaUser />}
                  />
                  <div style={{ color: "red" }}>
                    {errors["name"] ? errors["name"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my="20px">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Email{" "}
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Input
                    type={"email"}
                    value={value}
                    onChange={onChange}
                    placeholder="j.jameson@mybusiness.com"
                    leftIcon={<FaEnvelope />}
                  />
                  <div style={{ color: "red" }}>
                    {errors["email"] ? errors["email"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my="20px">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Phone Number{" "}
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="phone"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <InputPhone value={value} onChange={onChange} />
                  <div style={{ color: "red" }}>
                    {errors["phone"] ? errors["phone"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          <Box my="20px">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Message
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="message"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  value={value}
                  onChange={onChange}
                  placeholder="Write a message to the fund manager..."
                />
              )}
            />

            <div style={{ color: "red" }}>
              {errors["message"] ? errors["message"]?.message : ""}
            </div>
          </Box>

          <Box my="20px">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Project Details (optional)
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="project"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <SelectSearch
                    data={projects}
                    setSelectOption={(d) => {
                      onChange(d.id);
                    }}
                    selectOption={projects.find((p) => p.id === value)}
                  />
                </>
              )}
            />

            <div style={{ color: "red" }}>
              {errors["project"] ? errors["project"]?.message : ""}
            </div>
          </Box>

          <Box mt={"32px"}>
            <Button
              full
              isSubmit
              fontWeight="700"
              // onClick={handleSubmit}
              isLoading={isLoading}
            >
              Send Invite
            </Button>
          </Box>
        </form>
      ) : (
        <Box pt={"20vh"} pb={"10vh"}>
          <Text align={"center"} fontSize={"24px"} fontWeight={700}>
            Fund Manager invited successfully.
          </Text>
        </Box>
      )}
    </BaseModal>
  );
};

export default InviteFundManagerFormModal;
