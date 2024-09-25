import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SidebarBackground from "../../assets/images/sidebar-background.svg";
import SidebarToggle from "../../components/Icons/SidebarToggle";
import Logo from "../../components/Logo";
import Logo2 from "../../components/Logo2";
import LogoIcon from "../../components/LogoIcon";
import builderSidebar from "../../data/builderSidebar.json";
import fundManagerSidebar from "../../data/fundManagerSidebar.json";
import superAdminSidebar from "../../data/superAdminSidebar.json";
import vendorSidebar from "../../data/vendorSidebar.json";
import BuilderModal from "../onboardingModals/BuilderModal";
import FundManagerModal from "../onboardingModals/fundManagerModal";
import VendorModal from "../onboardingModals/vendorModal";
import NavItem from "./NavItem";

export default function Sidebar({
  toggleSidebar,
  setToggleSidebar,
  userType,
  onClose,
  ...rest
}) {
  let LinkItems;

  if (userType === "BUILDER") {
    LinkItems = builderSidebar;
  }
  if (userType === "SUPPLIER") {
    LinkItems = vendorSidebar;
  }
  if (userType === "FUND_MANAGER") {
    LinkItems = fundManagerSidebar;
  }
  if (userType === "SUPER_ADMIN") {
    LinkItems = superAdminSidebar;
  }

  const isAdmin = userType === "SUPER_ADMIN" || userType === "ADMIN";
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isSubscribe } = userInfo;
  const [isOpen, setIsOpen] = useState("");
  const history = useHistory();
  const { pathname } = useLocation();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("welcome");

  return (
    <>
      {LinkItems && (
        <Box
          as="nav"
          pos="fixed"
          top="0"
          left="0"
          zIndex="sticky"
          bg={isAdmin ? "#12355A" : "#FFF"}
          bgImage={SidebarBackground}
          bgPosition="center"
          bgRepeat="no-repeat"
          w={toggleSidebar ? "auto" : "280px"}
          borderRight={"1px solid #F0F1F1"}
          {...rest}
          transition=".3s ease"
          h="100vh"
        >
          {/* <img
            src={SidebarBackground}
            style={{ maxWidth: "180px" }}
            alt="CutStruct Technology Limited"
          /> */}
          <Box p="56px 30px" pb="0" mb="40px">
            <Flex justifyContent="space-between" align="center" pb="40px">
              <Box>
                {toggleSidebar ? (
                  <LogoIcon fill={isAdmin ? "#fff" : "#12355B"} />
                ) : isAdmin ? (
                  <Logo maxWidth="135px" />
                ) : (
                  <Logo2 />
                )}
              </Box>

              <Box
                cursor="pointer"
                ml="18px"
                onClick={() =>
                  setToggleSidebar((toggleSidebar) => !toggleSidebar)
                }
                display={{ base: "none", lg: "block" }}
              >
                <SidebarToggle fill={isAdmin ? "#fff" : ""} />
              </Box>
            </Flex>
            <Box as="hr"></Box>
          </Box>
          <Box h="calc(100vh - 250px)" overflowX="hidden" overflowY="auto">
            <Box>
              <Box>
                {!toggleSidebar && !isAdmin && (
                  <Box pl="30px" pr="24px" mb="24px">
                    <Flex
                      align="center"
                      bgColor="primary"
                      px="24px"
                      borderRadius="4px"
                      w="100%"
                      height={"40px"}
                    >
                      <Text
                        color="#fff"
                        fontSize="14px"
                        fontWeight="700"
                        textTransform="uppercase"
                      >
                        {userType && userType.split("_").join(" ")}
                      </Text>

                      <Box
                        ml={"auto"}
                        background="secondary"
                        w={"8px"}
                        height={"100%"}
                      ></Box>
                    </Flex>
                  </Box>
                )}
              </Box>
              {Object.keys(LinkItems).map((e, i) => {
                return (
                  <Box key={i}>
                    <Box
                      as="h4"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      pl="30px"
                      mb="24px"
                      color={isAdmin && "#fff"}
                    >
                      {e}
                    </Box>
                    <Flex
                      direction="column"
                      as="nav"
                      fontSize="sm"
                      color="#999"
                      aria-label="Main Navigation"
                      justifyContent="space-between"
                      h="calc(100% - 200px)"
                      className="side-nav"
                    >
                      <Box>
                        {LinkItems[e].map((item, index) => (
                          <NavItem
                            key={index}
                            submenu={item?.submenu}
                            icon={item?.icon}
                            toggleSidebar={toggleSidebar}
                            isAdmin={isAdmin}
                            closeSidebar={onClose}
                            onClick={() => {
                              if (isSubscribe) {
                                if (item?.submenu) {
                                  setIsOpen(item.title);
                                } else {
                                  history.push(item.url);
                                }
                              } else {
                                if (
                                  userType === "FUND_MANAGER" ||
                                  userType === "BUILDER"
                                ) {
                                  if (
                                    item.title === "Support" ||
                                    item.title === "Dashboard"
                                  ) {
                                    history.push(item.url);
                                  }
                                } else {
                                  if (item?.submenu) {
                                    setIsOpen(item.title);
                                  } else {
                                    history.push(item.url);
                                  }
                                }
                              }
                            }}
                            isOpen={isOpen}
                            active={
                              pathname === item.url ||
                              (item?.submenu &&
                                item.submenu.some((e) => pathname === e.url))
                            }
                            setIsOpen={setIsOpen}
                          >
                            {item.title}
                          </NavItem>
                        ))}
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Box>
          </Box>
          {!toggleSidebar && (
            <Box
              // pos="fixed"
              bottom="0px"
              pb="20px"
              px="40px"
              color="#999999"
              fontSize="12px"
              bgColor={isAdmin ? "#12355A" : "#FFF"}
            >
              <Box as="hr"></Box>
              <Box as="p" mt="24px">
                All rights reserved.
              </Box>
              <Box as="p">© 2024, Cutstruct Technologies Limited.</Box>
            </Box>
          )}
        </Box>
      )}
      {query === "new" &&
        (userType === "BUILDER" ? (
          <BuilderModal />
        ) : userType === "SUPPLIER" ? (
          <VendorModal />
        ) : (
          userType === "FUND_MANAGER" && <FundManagerModal />
        ))}
    </>
  );
}
