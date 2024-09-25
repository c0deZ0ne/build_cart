import {
  Box,
  Center,
  Collapse,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { useHistory } from "react-router-dom";
import DashboardIcon from "../../components/Icons/Dashboard";
import FundManagerIcon from "../../components/Icons/FundManager";
import PeopleIcon from "../../components/Icons/People";
import ProjectInvitationIcon from "../../components/Icons/ProjectInvitation";
import ProjectsIcon from "../../components/Icons/Projects";
import SettingsIcon from "../../components/Icons/SettingsIcon";
import SuppliersIcon from "../../components/Icons/Suppliers";
import SupportIcon from "../../components/Icons/Support";
import TeamIcon from "../../components/Icons/Team";
import Vault from "../../components/Icons/Vault";
import CopySuccess from "../../components/Icons/CopySuccess";
import Lock from "../../components/Icons/Lock";
import { FaLock } from "react-icons/fa";
import SidebarPopup from "../../components/Popup/SidebarPopup";
export default function NavItem(props) {
  const {
    icon,
    children,
    submenu,
    isOpen,
    setIsOpen,
    active,
    color,
    pathname,
    toggleSidebar,
    isAdmin,
    closeSidebar,
    ...rest
  } = props;
  const [hover, setHover] = useState(active);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isSubscribe, userType } = userInfo;
  const history = useHistory();
  const iconMapping = {
    ProjectsIcon,
    FundManagerIcon,
    SuppliersIcon,
    ProjectInvitationIcon,
    TeamIcon,
    Vault,
    SupportIcon,
    DashboardIcon,
    PeopleIcon,
    SettingsIcon,
    CopySuccess,
    Lock,
  };

  const Component = iconMapping[icon];
  const activeColor = isAdmin ? "#fff" : "#F5852C";

  useEffect(() => {
    setTimeout(() => {
      if (submenu && active) {
        setIsOpen(children);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submenu]);

  return (
    <SidebarPopup
      isOpenPopup={
        (userType === "FUND_MANAGER" || userType === "BUILDER") && !isSubscribe
      }
      closeSidebar={closeSidebar}
    >
      <Box
        cursor="pointer"
        color={isOpen === children || hover ? color : color}
        role="group"
        // textTransform={"capitalize"}
        fontSize={"16px"}
        pos={"relative"}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          if (!active) {
            setHover(false);
          }
        }}
        {...rest}
      >
        <Flex
          align="center"
          // borderLeft={active ? "10px solid #F3937A" : "10px solid transparent"}
          pr={!toggleSidebar && "24px"}
          w="100%"
          mb={submenu && isOpen === children ? "0px" : "18px"}
        >
          <Box
            as="div"
            bg={active && "#F5852C"}
            mr="32px"
            w="8px"
            h="40px"
            borderRadius="0px 8px 8px 0px"
          ></Box>
          <Flex
            align="center"
            pl="14px"
            pr="14px"
            py="8px"
            w="100%"
            borderRadius={toggleSidebar ? "10px 0px 0px 10px" : "40px"}
            bg={active && "rgba(245, 133, 44, 0.08)"}
            fontSize="16px"
            color={active && activeColor}
            fontWeight={active && "600"}
            _hover={{
              color: activeColor,
              bg: "rgba(245, 133, 44, 0.08)",
              fontWeight: "600",
            }}
          >
            {icon && (
              <Box
                fontSize={"24px"}
                fill={isOpen === children || hover ? color : color}
                mr="20px"
                // as={RxDashboard}
              >
                <Component
                  width="24"
                  height="24"
                  fill={
                    isOpen === children || hover || active ? activeColor : color
                  }
                  opacity={
                    isOpen === children || hover || active ? "1" : "0.56"
                  }
                />
              </Box>
            )}
            {!toggleSidebar && <Text> {children} </Text>}

            {submenu && (
              <Flex
                align="center"
                bg={
                  active ? "rgba(245, 133, 44, 0.08)" : "rgba(18, 53, 90, 0.08)"
                }
                w="24px"
                h="24px"
                borderRadius="100%"
                ml="auto"
                justifyContent="center"
              >
                <Icon
                  transition={"0.3s ease"}
                  as={HiChevronRight}
                  size={16}
                  display="block"
                  transform={isOpen === children && "rotate(90deg)"}
                />
              </Flex>
            )}
            {userType === "FUND_MANAGER" || userType === "BUILDER"
              ? children === "Support"
                ? null
                : !isSubscribe && (
                    <>
                      <Center
                        ml="auto"
                        w="30px"
                        h="30px"
                        rounded="50px"
                        bg="#333"
                      >
                        <FaLock />
                      </Center>
                    </>
                  )
              : null}
          </Flex>
        </Flex>
        {submenu && (
          <Collapse in={isOpen === children}>
            <Stack mb="18px">
              {submenu?.map((item, index) => (
                <Flex
                  key={index}
                  textTransform="capitalize"
                  onClick={() => {
                    history.push(item.url);
                  }}
                  ml="60px"
                  color={item.url === pathname && "#F5852C"}
                  p="6px 10px 0px"
                  _hover={{
                    color: "#F5852C",
                  }}
                >
                  <Flex
                    py="0"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      as="span"
                      w="8px"
                      h="8px"
                      borderRadius="100%"
                      bg={item.url === pathname && "#F5852C"}
                    ></Box>
                    <Text ml="20px"> {item.title}</Text>
                  </Flex>
                </Flex>
              ))}
            </Stack>
          </Collapse>
        )}
      </Box>
    </SidebarPopup>
  );
}
