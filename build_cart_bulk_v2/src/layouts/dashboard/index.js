import {
  Box,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardWrapper({
  children,
  pageTitle = "",
  projectOptions,
  handleProjectData,
}) {
  const sidebar = useDisclosure();
  const [userInfo, setuserInfo] = useState({ data: { type: "BUILDER" } });
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [toggleSidebar, setToggleSidebar] = useState(false);

  useEffect(() => {
    if (user?.userType) {
      setuserInfo({ data: { type: user?.userType } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box as="section" bg="#FCFCFD" minH="100vh" overflowX={"hidden"}>
      <Sidebar
        display={["none", "none", "none", "unset"]}
        userType={userInfo?.data?.type}
        setToggleSidebar={setToggleSidebar}
        toggleSidebar={toggleSidebar}
      />

      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar
            w="full"
            borderRight="none"
            userType={userInfo?.data?.type}
            setToggleSidebar={setToggleSidebar}
            toggleSidebar={toggleSidebar}
            onClose={sidebar.onClose}
          />
        </DrawerContent>
      </Drawer>
      <Box
        ml={[0, 0, 0, toggleSidebar ? "150px" : "280px"]}
        transition=".3s ease"
        pos="relative"
        zIndex={"100"}
      >
        <Navbar
          sidebar={sidebar}
          pageTitle={pageTitle}
          projectOptions={projectOptions}
          handleProjectData={handleProjectData}
          toggleSidebar={toggleSidebar}
        />
        <Box
          as="main"
          px={{ base: "15px", lg: "15px", xl: "20px" }}
          py="30px"
          pos={"relative"}
        >
          <Container
            maxW="100%"
            borderRadius={"8px"}
            // pos={"relative"}
            p="0"
            overflow={"hidden"}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
