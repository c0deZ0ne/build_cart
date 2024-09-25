import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as yup from "yup";
import Button from "../../components/Button";
import Input from "../../components/Input";
import AuthLayout from "./AuthLayout";
import ContactAdmin from "../../layouts/onboardingModals/contactAdmin";
import OTPScreen from "./OtpScreen";
import instance from "../../utility/webservices";
import { handleError } from "../../utility/helpers";

const RequestOTP = () => {
  const [email, setEmail] = React.useState("");
  const [isSuccess, setSuccess] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
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

  const handleRessendOtp = async (email) => {
    try {
      await instance.post(`user/request-email-otp/${email}`, {
        email,
      });
      setSuccess(true);
      setLoading(false);
      toast({
        description:
          "Request to reset password successful, kindly use the otp sent to your email to change your password",
        status: "success",
      });
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = (data) => {
    setLoading(true);
    setEmail(data?.email);
    handleRessendOtp(data.email);
  };

  return (
    <>
      {isSuccess ? (
        <OTPScreen email={email} />
      ) : (
        <AuthLayout>
          <Flex direction="column" h="90vh" justify="space-around">
            <form
              style={{ padding: "70px 0 10px" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Heading color="#F5862E" fontSize={["24px", "34px"]}>
                ENTER EMAIL ADDRESS
              </Heading>
              <Text color="#999999" my="10px">
                Enter the email address for verification.
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
                Request OTP
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

export default RequestOTP;
