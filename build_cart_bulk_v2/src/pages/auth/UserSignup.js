import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize, isArray } from "lodash";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa6";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom";
import * as yup from "yup";
import Button from "../../components/Button";
import CompanyPolicy from "../../components/CompanyPolicy/CompanyPolicy";
import { useRegisterUserMutation } from "../../redux/api/user/userRegisterSlice";
import Input, { InputPhone } from "../../components/Input";
import PasswordChecker, {
  PasswordCondition,
} from "../../components/PasswordChecker/PasswordChecker";
import Popup from "../../components/Popup/Popup";
import OTPScreen from "../auth/OtpScreen";
import AuthLayout from "./AuthLayout";
import GoBackButton from "../../components/GoBackButton/GoBackButton";

const UserSignup = () => {
  const [passwordError, setPasswordError] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userType, setUserType] = React.useState("BUILDER");
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { persona } = useParams();
  const userPersona = persona.replaceAll("-", "_").toUpperCase();
  const invitationId = queryParams.get("invitationId");
  const projectId = queryParams.get("projectId");

  const users = [
    {
      info: "Register as a financier of construction projects to efficiently distribute and oversee resources across various projects.",
      type: "Fund Manager",
      description: `As a fund manager, you can effectively create development project
              tenders, receive bids from developers, award project contract, and
              fund projects. Fund managers can track material purchases made by
              developers for an ongoing construction project and generate
              project expenditure report at the end of the project.`,
      value: "FUND_MANAGER",
    },
    {
      info: "Sign up as a real estate developer, contractor or builder for convenient access to high-quality building materials and a streamlined procurement process.",
      type: "Builder",
      value: "BUILDER",
      description:
        "Builders can create construction projects, add team members to play different roles, upload material schedule and raise RFQs for manufacturers and distributors to bid.",
    },
    {
      info: "Boost your monthly sales as a seller of building materials by signing up as a vendor.",
      type: "Supplier",
      value: "SUPPLIER",
      description:
        "The supplier has access to receive and bid for RFQs for Africa's biggest construction projects.",
    },
  ];

  const filteredUser = users.find((e) => e?.value === userPersona);

  useEffect(() => {
    setUserType(userPersona);
  }, [userPersona]);

  const registerUserSchema = yup.object({
    businessName: yup.string().required("Business name is required"),
    name: yup.string().required("Full name is required"),
    email: yup.string().required("Email is required").email(),
    password: yup.string().required("Password is required"),
    phone: yup.string().required("Phone number is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      businessName: "",
    },
    resolver: yupResolver(registerUserSchema),
  });

  // 👇 Calling the User Register Mutation
  const [registerUserApi, { data, isLoading, isSuccess, error, isError }] =
    useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const handleSuccess = (userData) => {
      toast({
        description:
          "You have successfully registered kindly check your email for otp to verify your email",
        status: "success",
      });
      setLoading(false);
    };

    const handleError = (error) => {
      setLoading(false);
      const errorMessage = isArray(error?.data?.message)
        ? error?.data?.message[0]
        : error?.data?.message;

      toast({
        description: errorMessage,
        status: "error",
      });
    };

    if (isSuccess) {
      const userData = {
        userId: data.data.id,
        businessName: capitalize(data.data.businessName),
        name: capitalize(data.data.name),
        email: data.data.email,
        phone: data.data.phoneNumber,
      };

      handleSuccess(userData);
    }
    if (isError) {
      handleError(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = (data) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[~!@£#$%^&*()_\-+=,.<>?/|':;{}])[A-Za-z\d~!@£#$%^&*()_\-+=,.<>?/|':;{}]{8,}$/;

    if (!passwordRegex.test(data.password)) {
      return setPasswordError(true);
    }
    setPasswordError(false);
    setLoading(true);
    registerUserApi({
      businessName: data.businessName,
      name: data.name,
      email: data.email.toLowerCase(),
      phoneNumber: data.phone,
      acceptTerms: true,
      password: data.password,
      userType: userType,
    });

    setPassword(data?.password);
    setEmail(data?.email);
  };

  return (
    <>
      {isSuccess ? (
        <OTPScreen
          email={email}
          password={password}
          userType={userType}
          projectId={projectId}
          invitationId={invitationId}
        />
      ) : (
        <AuthLayout>
          <>
            <GoBackButton />
            <Heading color="#F5862E" fontSize={["24px", "34px"]}>
              Sign Up
            </Heading>
            <Text color="#999999" my="10px">
              Get access to state of the art construction support for your
              projects.
            </Text>{" "}
            <SimpleGrid columns={[2, 2, 3, 3]} spacing="20px" m="20px 0 10px">
              <Flex
                padding="10px"
                align="center"
                justify="space-between"
                borderRadius="6px"
                cursor="pointer"
                bg={"#12355A"}
                color={"#ffffff"}
                border={"1px solid #12355A"}
                fontSize={["14px", "16px"]}
              >
                <Text textAlign="center" w="100%">
                  {filteredUser.type}
                </Text>
                <Box>
                  <Popup info={filteredUser.info} fill={"#ffffff"} />
                </Box>
              </Flex>
              {/* ))} */}
            </SimpleGrid>
            <Box fontSize={14}>{filteredUser?.description}</Box>
            <Box mt="20px">
              <hr />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box fontSize="14px" mt="30px" mb="30px">
                <Box my={"15px"}>
                  <Text>
                    Business Name <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    control={control}
                    name="businessName"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="Business Name"
                          value={value}
                          onChange={onChange}
                        />
                        <div style={{ color: "red" }}>
                          {errors["businessName"]
                            ? errors["businessName"]?.message
                            : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
                <Box my={"15px"}>
                  <Text>
                    Name (business contact person)
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="Full Name"
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
                <Box my={"15px"}>
                  <Text>
                    Email Address (business contact person){" "}
                    <span style={{ color: "red" }}>*</span>
                  </Text>

                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="yourname@example.com"
                          value={value}
                          onChange={onChange}
                          leftIcon={<FaEnvelope />}
                        />
                        <div style={{ color: "red", fontSize: "14px" }}>
                          {errors["email"] ? errors["email"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
                <Box my={"15px"}>
                  <Text>
                    Phone Number (business contact person){" "}
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: true,
                      minLength: 7,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <InputPhone value={value} onChange={onChange} />
                    )}
                  />

                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors["phone"] ? errors["phone"]?.message : ""}
                  </div>
                </Box>

                <Box my="20px">
                  <Flex justify="space-between">
                    <Text>
                      Password <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Popup info={<PasswordCondition />}></Popup>
                  </Flex>
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

                        <div style={{ color: "red", fontSize: "14px" }}>
                          {errors["password"]
                            ? errors["password"]?.message
                            : ""}
                        </div>
                        {passwordError && (
                          <div style={{ color: "red", fontSize: "14px" }}>
                            Error! password does not conform with the security
                            measures.
                            <PasswordChecker control={control} />
                          </div>
                        )}
                      </Box>
                    )}
                  />
                </Box>
              </Box>

              <Box>
                <CompanyPolicy />
                <Button full isSubmit isLoading={loading}>
                  Create Account
                </Button>

                <Box textAlign="center" mt="20px">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span
                      style={{
                        color: "#F5862E",
                        marginLeft: "5px",
                        fontWeight: "600",
                      }}
                    >
                      Login.
                    </span>
                  </Link>
                </Box>
              </Box>
            </form>
          </>
        </AuthLayout>
      )}
    </>
  );
};

export default UserSignup;
