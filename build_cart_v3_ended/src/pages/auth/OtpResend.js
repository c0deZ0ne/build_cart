import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  Input,
  Heading,
  useMediaQuery,
} from "@chakra-ui/react";
import SERVICES from "../../utility/webservices";
import livevendotp from "../../assets/livevendotp.png";
import Button from "../../components/Button";
import AuthLayout from "./components/AuthLayout";
import OTPScreen from "./OtpScreen";
import { useToast } from "react-toastify";
import ContactAdmin from "../../layouts/onboardingModals/contactAdmin";

const OtpResend = () => {
  const [email, setEmail] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const toast = useToast();

  const handleOtpResend = async () => {
    try {
      await SERVICES.post(`user/request-email-otp/${email}`, {
        email: email,
      });
      toast.success("OTP resent successfully");
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const [isLessThan1000] = useMediaQuery("(max-width: 1000px)");
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");
  const [isLessThan500] = useMediaQuery("(max-width: 500px)");
  return (
    <>
      <AuthLayout>
        {isSuccess ? (
          <OTPScreen email={email} password={""} />
        ) : (
          <Flex
            h={isLessThan1000 ? "80vh" : "87vh"}
            m={isLessThan1000 && "50px 0"}
            alignItems={"center"}
          >
            <Flex
              justify="space-between"
              w={isLessThan768 ? "100%" : "90%"}
              m="0 auto"
              direction={isLessThan768 ? "column" : "row"}
            >
              <Box
                w={isLessThan768 ? "70%" : isLessThan1000 ? "50%" : "45%"}
                m="0 auto"
              >
                <Image src={livevendotp} alt="" w={"70%"} m="0 auto" />
              </Box>
              <Flex
                w={isLessThan768 ? "100%" : isLessThan1000 ? "70%" : "55%"}
                alignItems={"center"}
              >
                <Box w={"90%"} m="0 auto" p="20px 30px">
                  <Heading color="#C0C0C1" mb="50px" fontSize={"22px"}>
                    Request for an OTP
                  </Heading>
                  <div>
                    <Flex
                      justify={"space-between"}
                      direction={isLessThan500 ? "column" : "row"}
                      my={"20px"}
                    >
                      <Box w={isLessThan500 ? "100%" : "50%"} mb="5px">
                        <Text>Enter your email </Text>
                        <Text fontSize={".85em"} w="90%" fontWeight={"300"}>
                          We will send you a link with your OTP to your email
                        </Text>
                      </Box>
                      <Box w={isLessThan500 ? "100%" : "50%"}>
                        <Input
                          placeholder="Email@email.com"
                          fontWeight={"300"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          outline="none !important"
                          p="22px 10px"
                        />
                      </Box>
                    </Flex>
                    <Flex justify={"space-between"} my={"20px"}>
                      {isLessThan500 ? "" : <Box></Box>}
                      <Box w={isLessThan500 ? "100%" : "50%"}>
                        <Box my="10px">
                          <Button onClick={handleOtpResend} type="submit">
                            Submit
                          </Button>
                        </Box>
                      </Box>
                    </Flex>
                  </div>
                  <ContactAdmin />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        )}
      </AuthLayout>
    </>
  );
};

export default OtpResend;
