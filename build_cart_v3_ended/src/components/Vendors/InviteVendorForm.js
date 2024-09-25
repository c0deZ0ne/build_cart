import { Box, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Button from "../../components/Button";
import Input, { InputPhone } from "../../components/Input";
import BaseModal from "../../components/Modals/Modal";
import { useSendInviteToVendorMutation } from "../../redux/api/builder/builder";
import { userData } from "../../redux/store/store";

/**
 *
 * @param {{isOpen: Boolean, closeModal: Function}} param0
 * @returns
 */
const InviteVendorForm = ({ isOpen, closeModal }) => {
  const userInfo = useSelector(userData);

  const [sendInviteToVendor, { isLoading, isSuccess, error, isError }] =
    useSendInviteToVendorMutation();

  const formSchema = yup.object({
    name: yup.string().required("Name is required").required(),
    email: yup.string().required("Email is required").email(),
    phone: yup.string().required("Phone number is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log({ data });

    const formData = {
      toName: data.name,
      toEmail: data.email,
      Location: "Lagos Nigeria",
      inviteeName: userInfo.data.userName,
    };

    sendInviteToVendor(formData);
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
      title="Invite Suplier"
      subtitle="Fill out the form below with the details of the supplier to invite."
      showHeader={!isSuccess}
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box my="20px">
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

          <Box mt={"66px"}>
            <Button
              full
              isSubmit
              fontWeight="700"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Send Invite
            </Button>
          </Box>
        </form>
      ) : (
        <Box pt={"20vh"} pb={"10vh"}>
          <Text align={"center"} fontSize={"24px"} fontWeight={700}>
            Supplier invited successfully
          </Text>
        </Box>
      )}
    </BaseModal>
  );
};

export default InviteVendorForm;
