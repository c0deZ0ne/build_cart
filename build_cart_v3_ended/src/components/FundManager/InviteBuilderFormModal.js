import { Box, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useSendInviteToBuilderMutation } from "../../redux/api/fundManager/fundManager";
import { userData } from "../../redux/store/store";
import Button from "../Button";
import Input, { InputPhone, TextArea } from "../Input";
import BaseModal from "../Modals/Modal";
import SelectSearchAlt from "../SelectSearchAlt";
import SuccessMessage from "../SuccessMessage";

/**
 *
 * @param {{isOpen: Boolean, closeModal: Function, projects: {name: string, id: string}[]}} props
 * @returns
 */
const InviteBuilderFormModal = ({ isOpen, closeModal, projects = [] }) => {
  const userInfo = useSelector(userData);

  const [sendFn, { isLoading, isSuccess, error, isError }] =
    useSendInviteToBuilderMutation();

  const [project, setProject] = useState("");

  const formSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Input must be a valid email"),
    phone: yup.string().required("Phone number is required"),
    message: yup.string().required("Message is required"),
    project: yup.string().required("Project is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
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
    console.log({ data });

    const formData = {
      toName: data.name,
      toEmail: data.email,
      // Location: "Lagos",
      message: data.message,
      inviteeName: userInfo.data.userName,
      phoneNumber: data.phone,
      projectId: data.project,
    };

    if (!formData.projectId) {
      delete formData.projectId;
    }

    console.log(formData);

    sendFn(formData);
  };

  const toast = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "Invite sent!",
        status: "success",
      });
    }
    if (isError && error) {
      toast({ description: error.data.message, status: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error]);

  return (
    <BaseModal
      onClose={closeModal}
      isOpen={isOpen}
      title="Invite Builder"
      subtitle="Enter the details of the builder below to get them on the platform"
      showHeader={!isSuccess}
      bodyOverflow="initial"
    >
      {!isSuccess ? (
        <Box py={"1rem"}>
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
                    placeholder="Write a message to the builder ..."
                  />
                )}
              />

              <div style={{ color: "red" }}>
                {errors["message"] ? errors["message"]?.message : ""}
              </div>
            </Box>

            <Box my="20px">
              <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                Project Details
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
                    <SelectSearchAlt
                      options={projects}
                      onChange={(d) => {
                        onChange(d.id);
                      }}
                      value={projects.find((p) => p.id === value)}
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
        </Box>
      ) : (
        <Box pt={"20vh"} pb={"10vh"}>
          <SuccessMessage
            message={"You have successfully invited " + getValues("name") + "."}
          />
        </Box>
      )}
    </BaseModal>
  );
};

export default InviteBuilderFormModal;
