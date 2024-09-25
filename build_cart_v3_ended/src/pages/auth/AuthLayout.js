import React from "react";
import { Box, Flex, Image, useMediaQuery, Center } from "@chakra-ui/react";
import SignUpImage from "../../assets/images/signup2.png";
import SignUpBgImage from "../../assets/images/signupbg.png";
import CutStructLogo from "../../assets/images/cutstructlogo.png";
import Logo from "../../components/Logo";
import Logo2 from "../../components/Logo2";

const AuthLayout = ({ children }) => {
  const [isLessThan900] = useMediaQuery("(max-width: 900px)");
  const [isLessThan1310] = useMediaQuery("(max-width: 1310px)");

  return (
    <div>
      <Flex w="100vw" h="full" direction={isLessThan900 ? "column" : "row"}>
        {!isLessThan900 && (
          <Box
            color="#ffffff"
            bgColor="#12355A"
            bgImage={SignUpBgImage}
            bgRepeat="no-repeat"
            bgSize="cover"
            w={isLessThan900 ? "100%" : "35%"}
            minH={isLessThan900 ? "200px" : "100vh"}
            h={isLessThan900 && "500px"}
            overflow="hidden"
          >
            <Flex
              direction="column"
              justify={"space-between"}
              p="50px 0 0"
              h={isLessThan900 ? "100%" : "100vh"}
            >
              <Box m="0 20px">
                <Logo />
              </Box>
              <Box>
                <Image
                  src={SignUpImage}
                  w={isLessThan900 ? "65%" : "100%"}
                  alt="login"
                />
              </Box>
            </Flex>
          </Box>
        )}
        <Box p={["0", "10"]} w={isLessThan900 ? "100%" : "65%"}>
          {isLessThan900 && (
            <Box m="30px 20px">
              <Logo2 />
            </Box>
          )}
          <Center
            bg="#ffffff"
            bgImage={CutStructLogo}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgBlendMode="lighten"
            bgColor="rgba(255,255,255,.97)"
            // minH="100vh"
          >
            <Box
              // py="20px"
              w={["90%", "90%", "90%", isLessThan1310 ? "80%" : "60%"]}
            >
              {children}
            </Box>
          </Center>
        </Box>
      </Flex>
    </div>
  );
};

export default AuthLayout;
