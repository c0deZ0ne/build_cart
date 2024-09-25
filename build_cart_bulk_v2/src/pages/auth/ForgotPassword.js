import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { isArray } from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as yup from "yup";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForgotPasswordMutation } from "../../redux/api/auth/authSlice";
import AuthLayout from "./AuthLayout";
import ChangePassword from "./ChangePassword";
import ContactAdmin from "../../layouts/onboardingModals/contactAdmin";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const toast = useToast();
  const registerSchema = yup.object({
    email: yup.string().required("Email is required").email(),
  });

  const methods = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(registerSchema),
  });

  // 👇 Calling the Login Mutation
  const [forgotPassword, { isLoading, isSuccess, error, isError, data }] =
    useForgotPasswordMutation();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  React.useEffect(() => {
    if (isSuccess) {
      toast({
        description:
          "Request to reset password successful, kindly use the otp sent to your email to change your password",
        status: "success",
      });
    }

    if (isError) {
      if (error) {
        toast({
          description: isArray(error?.data?.message)
            ? error?.data?.message[0]
            : error?.data?.message,
          status: "error",
        });
      } else {
        toast({
          description: isArray(error?.data?.message)
            ? error?.data?.message[0]
            : error?.data?.message,
          status: "error",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = (data) => {
    forgotPassword(data.email);
    setEmail(data?.email);
  };

  return (
    <>
      {isSuccess ? (
        <ChangePassword
          email={email}
          resetPasswordOtp={data?.data?.resetPasswordOtp}
        />
      ) : (
        <AuthLayout>
          <Flex direction="column" h="90vh" justify="space-around">
            <form
              style={{ padding: "70px 0 10px" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Heading color="#F5862E" fontSize={["24px", "34px"]}>
                Forgot Password?
              </Heading>
              <Text color="#999999" my="10px">
                No worries, we'll send you instructions to reset your password.
              </Text>
              <Box fontSize="14px" my="50px">
                <Box my={"20px"}>
                  <Text my={"5px"}>
                    Enter Email{" "}
                    <Text as="span" color="red">
                      *
                    </Text>{" "}
                  </Text>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="yourname@example.com"
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
              </Box>
              <Button full isSubmit isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
            <Box my="50px">
              <Box textAlign="center" mt="20px">
                Back to
                <Link to="/login">
                  <span
                    style={{
                      color: "#F5862E",
                      marginLeft: "5px",
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </span>
                </Link>
              </Box>
              <ContactAdmin />
            </Box>
          </Flex>
        </AuthLayout>
      )}
    </>
  );
};

export default ForgotPassword;
