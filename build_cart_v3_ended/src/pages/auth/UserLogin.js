import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleLogin } from "@react-oauth/google";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import GoogleImage from "../../assets/images/google.svg";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Popup from "../../components/Popup/Popup";
import ContactAdmin from "../../layouts/onboardingModals/contactAdmin";
import {
  useLoginUserMutation,
  useLoginUserWithSSOMutation,
} from "../../redux/api/auth/authSlice";
import { handleError, handleSuccess } from "../../utility/helpers";
import SERVICES from "../../utility/webservices";
import AuthLayout from "./AuthLayout";
import { getTokenInfo } from "./services/api/googleLoginAPI";

const UserLogin = () => {
  const toast = useToast();
  let history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [userType, setUserType] = React.useState("BUILDER");
  const users = [
    {
      info: "Register as a financier of construction projects to efficiently distribute and oversee resources across various projects.",
      type: "Fund Manager",
      value: "FUND_MANAGER",
    },
    {
      info: "Sign up as a real estate developer, contractor or builder for convenient access to high-quality building materials and a streamlined procurement process.",
      type: "Builder",
      value: "BUILDER",
    },
    {
      info: "Boost your monthly sales as a seller of building materials by signing up as a vendor.",
      type: "Supplier",
      value: "SUPPLIER",
    },
  ];

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
  const [
    loginUserWithSSO,
    {
      isLoading: ssoIsLoading,
      isSuccess: ssoIsSuccess,
      error: ssoError,
      isError: ssoIsError,
      data: ssoData,
    },
  ] = useLoginUserWithSSOMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const loginSuccess = async () => {
    handleSuccess("Login successful");
    setLoading(false);
  };

  React.useEffect(() => {
    if (isSuccess) {
      if (data?.data?.userType === "BUILDER") {
        history.push("/builder/dashboard");
      } else if (data?.data?.userType === "SUPPLIER") {
        history.push("/vendor/dashboard");
      } else if (data?.data?.userType === "ADMIN") {
        history.push("/admin/dashboard");
      } else if (data?.data?.userType === "FUND_MANAGER") {
        history.push("/fund-manager/dashboard");
      }

      loginSuccess();
    }

    if (ssoIsSuccess) {
      if (ssoData?.data?.userType === "BUILDER") {
        SERVICES.get("builder/profile")
          .then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data.data));
          })
          .then(() => {
            history.push("/dashboard");
            loginSuccess();
          });
      } else if (ssoData?.data?.userType === "SUPPLIER") {
        SERVICES.get("vendor/account/profile")
          .then((response) => {
            localStorage.setItem(
              "user",
              JSON.stringify(response?.data?.data?.vendorProfile),
            );
          })
          .then(() => {
            history.push("/vendor/dashboard");
            loginSuccess();
          });
      } else if (ssoData?.data?.userType === "ADMIN") {
        history.push("/admin/dashboard");
        loginSuccess();
      } else if (ssoData?.data?.userType === "FUND_MANAGER") {
        history.push("/fund-manager/dashboard");
        loginSuccess();
      }
    }

    if (isError) {
      if (error) {
        handleError(error);
      } else {
        handleError(error);
      }
      setLoading(false);
    }
    if (ssoIsError) {
      if (ssoError) {
        toast({
          description: Array.isArray(ssoError?.data?.message)
            ? ssoError?.data?.message[0]
            : ssoError?.data?.message,
          status: "error",
        });
      } else {
        toast({
          description: Array.isArray(ssoError?.data?.message)
            ? ssoError?.data?.message[0]
            : ssoError?.data?.message,
          status: "error",
        });
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, ssoIsLoading]);

  const onSubmit = (data) => {
    setLoading(true);
    loginUser(data);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await getTokenInfo(tokenResponse.access_token);

        loginUserWithSSO({
          email: userInfo?.email,
        });
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error) => console.log(error),
  });

  return (
    <AuthLayout>
      <Heading mt="40px" color="#F5862E" fontSize={["24px", "34px"]}>
        Welcome back!
      </Heading>
      <Text color="#999999" my="10px">
        You can login as Fund Manager, Builder, or a Supplier.
      </Text>
      <SimpleGrid columns={[2, 2, 3, 3]} spacing="20px" my="20px">
        {users.map((user, i) => (
          <Flex
            key={i}
            padding="10px"
            align="center"
            justify="space-between"
            borderRadius="6px"
            cursor="pointer"
            bg={user.value === userType ? "#12355A" : "#ffffff"}
            color={user.value === userType ? "#ffffff" : "#999999"}
            border={
              user.value === userType
                ? "1px solid #12355A"
                : "1px solid #999999"
            }
            onClick={() => {
              setUserType(user.value);
            }}
            fontSize={["14px", "16px"]}
          >
            <Text textAlign="center" w="100%">
              {user.type}
            </Text>
            <Box>
              <Popup
                info={user.info}
                key={i}
                fill={user?.value === userType ? "#ffffff" : "#999999"}
              />
            </Box>
          </Flex>
        ))}
      </SimpleGrid>

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
          <Flex my="20px" alignContent={"center"} alignItems={"center"}>
            <Box w={"45%"}>
              <hr />
            </Box>
            <Text color={"#303030"} mx="20px">
              Or
            </Text>
            <Box w={"45%"}>
              <hr />
            </Box>
          </Flex>
          {userType !== "FUND_MANAGER" && (
            <Button
              leftIcon={<Image src={GoogleImage} alt="" />}
              full
              variant="solid"
              // background="#fff"
              border="1px solid #303030"
              color="#303030"
              onClick={loginWithGoogle}
            >
              Continue with Google
            </Button>
          )}

          <Box textAlign="center" mt="20px">
            No account yet?{" "}
            <Link to="/auth/signup">
              <span
                style={{
                  color: "#F5862E",
                  marginLeft: "5px",
                  fontWeight: 600,
                }}
              >
                Create One!
              </span>
            </Link>
          </Box>
        </Box>
      </form>
      {userType === "FUND_MANAGER" && <ContactAdmin />}
    </AuthLayout>
  );
};

export default UserLogin;
