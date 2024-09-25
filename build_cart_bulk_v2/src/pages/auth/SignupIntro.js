import {
  Box,
  Flex,
  Heading,
  useMediaQuery,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BuilderImage from "../../assets/images/auth-builder.png";
import SupplierImage from "../../assets/images/auth-supplier.png";
import FundmanagerImage from "../../assets/images/auth-fundmanager.png";

const SignupIntro = () => {
  const [index, setIndex] = React.useState(-1);
  const personas = [
    {
      info: "Builders can create construction projects, add team members to play different roles, upload material schedule and raise RFQs for manufacturers and distributors to bid.",
      link: "/auth/signup/builder",
      btn: "Sign up as a builder",
      img: BuilderImage,
    },
    {
      info: "The vendor has access to receive and bid for RFQs for Africa's biggest construction projects.",
      link: "/auth/signup/supplier",
      btn: "Sign up as a supplier",
      img: SupplierImage,
    },
    {
      info: "As a fund manager, you can effectively create development project tenders, receive bids from developers, award project contract, and fund projects. Fund managers can track material purchases made by developers for an ongoing construction project and generate project expenditure report at the end of the project.",
      link: "/auth/signup/fund-manager",
      btn: "Sign up as a fund manager",
      img: FundmanagerImage,
    },
  ];

  const [isBetween900and1200] = useMediaQuery(
    "(min-width: 90px) and (max-width: 1200px)",
  );

  return (
    <AuthLayout width="100%">
      <Heading mt="40px" color="#F5862E" fontSize={["24px", "34px"]}>
        Sign Up!
      </Heading>
      <Text color="#999999" my="10px">
        Select your user type to sign up.
      </Text>

      <Flex direction="column" py={"40px"}>
        <SimpleGrid
          columns={[1, 1, 3, isBetween900and1200 ? 2 : 3]}
          spacing="20px"
          my="20px"
        >
          {personas.map((persona, i) => (
            <Box
              position="relative"
              key={i}
              onMouseEnter={() => setIndex(i)}
              onMouseLeave={() => setIndex(-1)}
            >
              <Flex
                pb={"30px"}
                bg="#fff"
                direction="column"
                alignItems="center"
                rounded={4}
                boxShadow="0px 0px 4.018px 0.502px rgba(18, 53, 90, 0.04)"
                backgroundColor={i === index ? "rgba(96, 96, 96, 1)" : "#fff"}
              >
                <Flex
                  background={`url(${persona?.img}) no-repeat center`}
                  backgroundColor={
                    i === index ? "rgba(96, 96, 96, 0.70)" : "#fff"
                  }
                  backgroundBlendMode="multiply"
                  h={300}
                  className="dddd"
                  rounded={4}
                  justify="center"
                >
                  <Flex justify="center" alignItems="center">
                    <Text
                      fontWeight={500}
                      fontSize="15px"
                      px={2}
                      color="#fff"
                      visibility={i === index ? "visible" : "hidden"}
                    >
                      {persona.info}
                    </Text>
                  </Flex>
                </Flex>
                <Box position="relative">
                  <Button link={persona?.link}>{persona.btn}</Button>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

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
      </Flex>
    </AuthLayout>
  );
};

export default SignupIntro;
