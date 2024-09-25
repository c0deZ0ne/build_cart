import {
  Box,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useLoginUserMutation } from "../../redux/api/auth/authSlice";
import AuthLayout from "./AuthLayout";

const AdminLogin = () => {
  const toast = useToast();
  let history = useHistory();
  const [loading, setLoading] = React.useState(false);

  const registerSchema = yup.object({
    email: yup.string().required("Email is required").email(),
    password: yup.string().required("Password is required"),
  });

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(registerSchema),
  });

  // 👇 Calling the Login Mutation
  const [loginUser, { isLoading, isSuccess, error, isError, data }] =
    useLoginUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const loginSuccess = async () => {
    toast({
      description: "Login successful",
      status: "success",
    });
    setLoading(false);
  };

  React.useEffect(() => {
    if (isSuccess) {
      if (Boolean(data?.data?.firstLogin)) {
        return history.push("/admin/create-password");
      }

      if (data?.data?.userType === "SUPER_ADMIN") {
        history.push("/super-admin/dashboard");
      }

      loginSuccess();
    }
    if (isError) {
      if (error) {
        toast({
          description: Array.isArray(error?.data?.message)
            ? error?.data?.message[0]
            : error?.data?.message,
          status: "error",
        });
      } else {
        toast({
          description: Array.isArray(error?.data?.message)
            ? error?.data?.message[0]
            : error?.data?.message,
          status: "error",
        });
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = (data) => {
    setLoading(true);
    loginUser(data);
  };

  return (
    <AuthLayout>
      <Grid
        minHeight={"calc(100dvh - 80px)"}
        alignItems={"center"}
        placeContent={"center"}
      >
        <Heading mt="40px" color="#F5862E" fontSize={["24px", "34px"]}>
          Welcome back!
        </Heading>
        <Text color="#999999" my="10px">
          Enter your Admin login details to access your dashboard.
        </Text>

        <Box mt="30px">
          <hr />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box fontSize="14px" my="40px">
            <Box my={"20px"}>
              <Text>
                Email Address <span style={{ color: "red" }}>*</span>
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
            <Box my="20px">
              <Text>
                Password <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="password"
                defaultValue=""
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
            <Flex justify="space-between" my="20px">
              <Checkbox colorScheme="orange">
                <span style={{ fontSize: "14px" }}>Remember me</span>
              </Checkbox>
              <Link to="/auth/forgot-password">
                <span
                  style={{
                    color: "#F5862E",
                    marginLeft: "5px",
                  }}
                >
                  Forgot Password?
                </span>
              </Link>
            </Flex>
          </Box>

          <Box>
            <Button full isSubmit isLoading={loading}>
              Sign In
            </Button>
          </Box>
        </form>
      </Grid>
    </AuthLayout>
  );
};

export default AdminLogin;
