import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PasswordChecker from "../../components/PasswordChecker/PasswordChecker";
import { useResetPasswordWithOtpMutation } from "../../redux/api/auth/authSlice";
import AuthLayout from "./AuthLayout";
import ContactAdmin from "../../layouts/onboardingModals/contactAdmin";

const ChangePassword = ({ email, resetPasswordOtp }) => {
  const toast = useToast();
  const history = useHistory();
  const passwordRegex =
    /^(?=.*\d)(?=.*[~!@£#$%^&*()_\-+=,.<>?/|':;{}])[A-Za-z\d~!@£#$%^&*()_\-+=,.<>?/|':;{}]{8,}$/;

  const resetPasswordSchema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .matches(passwordRegex, "Password must meet the specified criteria"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    resetPasswordOtp: yup.string().min(6).max(6),
  });

  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      resetPasswordOtp: "",
    },
    resolver: yupResolver(resetPasswordSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // 👇 Calling the Reset Password with OTP  Mutation
  const [resetPasswordWithOtp, { isLoading, isSuccess, error, isError }] =
    useResetPasswordWithOtpMutation();

  const onSubmit = (data) => {
    const { password, resetPasswordOtp } = data;
    resetPasswordWithOtp({
      resetPasswordOtp: Number(resetPasswordOtp),
      email,
      password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "Successfully changed your password, kindly login.",
        status: "success",
      });
      history.push("/");
    }

    if (isError) {
      toast({
        description: error.data?.message,
        status: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <AuthLayout>
      <Flex direction="column" h="90vh" justify="space-around">
        <form
          style={{ padding: "70px 0 10px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Heading color="#F5862E" fontSize={["24px", "34px"]}>
            Change Password {resetPasswordOtp}
          </Heading>
          <Text color="#999999" my="10px">
            In order to protect your account, ensure your password has:
          </Text>

          <PasswordChecker control={control} />

          <Box fontSize="14px" my="30px">
            <Box my="20px">
              <Text>
                New Password <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Input
                      type={"password"}
                      value={value}
                      onChange={onChange}
                      placeholder="Enter your Password"
                      leftIcon={<FaLock />}
                    />
                    <div style={{ color: "red" }}>
                      {errors["password"] ? errors["password"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box my="20px">
              <Text>
                Confirm Password <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Input
                      type={"password"}
                      value={value}
                      onChange={onChange}
                      placeholder="Enter your Password"
                      leftIcon={<FaLock />}
                    />
                    <div style={{ color: "red" }}>
                      {errors["confirmPassword"]
                        ? errors["confirmPassword"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
            <Box my="20px">
              <Text>
                OTP <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="resetPasswordOtp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Input
                      type={"text"}
                      value={value}
                      onChange={onChange}
                      placeholder="Enter OTP"
                      leftIcon={<FaLock />}
                    />
                    <div style={{ color: "red" }}>
                      {errors["resetPasswordOtp"]
                        ? errors["resetPasswordOtp"]?.message
                        : ""}
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
  );
};

export default ChangePassword;
