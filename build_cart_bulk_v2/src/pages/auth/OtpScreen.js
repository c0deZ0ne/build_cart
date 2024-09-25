import {
  Box,
  Center,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { lowerCase } from "lodash";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import CutStructLogo from "../../assets/images/cutstructlogo.png";
import Button from "../../components/Button";
import Checkmark from "../../components/Checkmark/Checkmark";
import Input from "../../components/Input";
import {
  useLoginUserMutation,
  useVerifyEmailotpMutation,
} from "../../redux/api/auth/authSlice";
import instance from "../../utility/webservices";
import AuthLayout from "./AuthLayout";
import { handleError, handleSuccess } from "../../utility/helpers";

const OTPScreen = ({
  email,
  password,
  fromSSO,
  userType,
  invitationId,
  projectId,
}) => {
  const history = useHistory();
  const toast = useToast();
  const userPersona = lowerCase(userType).replaceAll(" ", "-");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (fromSSO) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerSchema = yup.object({
    otp: yup
      .string()
      .required("OTP is required")
      .min(6, "Must be exactly 6 characters"),
  });

  const methods = useForm({
    defaultValues: {
      otp: "",
    },
    resolver: yupResolver(registerSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [verifyEmailOtp, { isLoading, isSuccess, error, isError }] =
    useVerifyEmailotpMutation();

  // 👇 Calling the Login Mutation
  const [
    loginUser,
    {
      isLoading: isLoginLoading,
      isSuccess: isLoginSuccess,
      error: errorLogin,
      isError: isLoginError,
    },
  ] = useLoginUserMutation();

  const onSubmit = ({ otp }) => {
    verifyEmailOtp({
      emailOtp: Number(otp),
      email,
    });
  };

  const handleRessendOtp = async () => {
    try {
      await instance.post(`user/request-email-otp/${email}`, {
        email,
      });
      toast({ description: "OTP resent successfully", status: "success" });
    } catch (error) {
      handleError(error);
    }
  };

  const userVerified = async () => {
    onOpen();

    setTimeout(() => {
      loginUser({ email, password });
    }, 1500);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "Successfully verified your email",
        status: "success",
      });

      userVerified();
    }

    if (isError) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isLoginSuccess) {
      handleSuccess("Login successful");
      onClose();

      history.push(
        `/${userPersona}/dashboard?welcome=new&invId=${
          invitationId ?? ""
        }&prId=${projectId ?? ""}`,
      );
    }

    if (isLoginError) {
      handleError(errorLogin);
      onClose();
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginLoading]);

  return (
    <>
      <AuthLayout>
        <Flex direction="column" h="80vh" justify="space-around">
          <form
            style={{ padding: "70px 0 10px" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Heading color="#F5862E" fontSize={["24px", "34px"]}>
              Enter OTP
            </Heading>
            <Text color="#999999" my="10px">
              Enter the OTP code sent to your registered email for email
              verification.
            </Text>
            <Box fontSize="14px" my="50px">
              <Box my={"20px"}>
                <Text>Enter OTP</Text>
                <Controller
                  control={control}
                  defaultValue=""
                  name="otp"
                  render={({ field: { onChange, value } }) => (
                    <Box w={"100%"}>
                      <Input
                        placeholder="Enter OTP"
                        value={value}
                        type="number"
                        onChange={(e) => {
                          if (e.target.value.length <= 6) {
                            onChange(e);
                          }
                        }}
                        leftIcon={<FaUnlockKeyhole />}
                      />

                      <div style={{ color: "red" }}>
                        {errors["otp"] ? errors["otp"]?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>
            </Box>
            <Button full isSubmit isLoading={isLoading}>
              Continue
            </Button>

            <Box fontSize="15px" mt="50px">
              <Flex justify="center" textAlign="center" mr="2">
                Didn't recieve OTP?
                <Text
                  cursor="pointer"
                  ml={2}
                  color="#F5862E"
                  onClick={handleRessendOtp}
                >
                  {" "}
                  Resend OTP
                </Text>
              </Flex>
            </Box>
          </form>

          <Box my="50px">
            <Text
              onClick={() => history.go(0)}
              cursor="pointer"
              textAlign="center"
              mt="20px"
            >
              Go Back
            </Text>
          </Box>
        </Flex>
      </AuthLayout>

      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        isOpen={isOpen}
        size={"sm"}
        onClose={onClose}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="20%"
          backdropBlur="3px"
        />
        <ModalContent p="30px">
          <Center
            bg="#ffffff"
            bgImage={CutStructLogo}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgBlendMode="lighten"
            bgColor="rgba(255,255,255,.97)"
          >
            <Box>
              <Checkmark />
              <Center>
                <Heading fontSize="20px">Email verified</Heading>
              </Center>
            </Box>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OTPScreen;
