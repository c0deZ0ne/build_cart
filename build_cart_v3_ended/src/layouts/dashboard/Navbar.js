import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../redux/features/user/userSlice";
import { userData } from "../../redux/store/store";
// import TagUserImage from '../../assets/images/tag-user.png';
import { HiChevronDown } from "react-icons/hi2";
import Select from "react-select";
// import Message from "../../components/Icons/Message";
import Notification from "../../components/Icons/Notification";
// import UserlogoImage from '../../assets/images/userlogo.svg';
// import SERVICES from '../../utility/webservices';
import { lowerCase } from "lodash";
import { HiOutlineLogout } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { builderApi } from "../../redux/api/builder/builder";
import { fundManagerApi } from "../../redux/api/fundManager/fundManager";
import { vendorApi } from "../../redux/api/vendor/vendor";
import { resetCountDownState } from "../../redux/features/subscription/subscriptionSlice";

export default function Navbar({
  isBack,
  pageTitle,
  sidebar,
  projectOptions,
  handleProjectData,
  toggleSidebar,
}) {
  const storedUser = localStorage.getItem("userInfo");
  const user = JSON.parse(storedUser);
  const dispatch = useDispatch();
  const userInfo = useSelector(userData);

  const [projectVal, setProjectVal] = useState({
    label: "Select a project",
    value: 0,
  });
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  const history = useHistory();

  const isAdmin =
    userInfo?.data?.userType === "SUPER_ADMIN" ||
    userInfo?.data?.userType === "ADMIN";

  const logoutHandle = () => {
    localStorage.clear();
    if (userInfo?.data?.token) {
      dispatch(vendorApi.util.resetApiState());
      dispatch(builderApi.util.resetApiState());
      dispatch(fundManagerApi.util.resetApiState());
      dispatch(resetCountDownState());
      dispatch(logout());
      if (isAdmin) {
        history.replace("/admin/login");
      } else {
        history.replace("/");
      }
    }
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={{ base: "20px", md: "32px" }}
      background="#ffffff"
      boxShadow={"0px 4px 8px rgba(208, 220, 250, 0.25)"}
      h="120px"
    >
      <Flex spacing={"24px"} align="center">
        <IconButton
          aria-label="Menu"
          display={["inline-flex", "inline-flex", "inline-flex", "none"]}
          onClick={sidebar.onOpen}
          icon={<MdMenu size={24} />}
          size="sm"
          mr="20px"
        />

        <Text fontSize={{ base: "16px", md: "25px" }} fontWeight={"600"}>
          {pageTitle}
        </Text>

        {!isLessThan768 &&
          (pageTitle === "Dashboard" || pageTitle === "dashboard") &&
          (userInfo.data.type === "BUYER" ||
            userInfo.data.type === "SPONSOR") && (
            <Select
              style={{ height: "40px" }}
              options={projectOptions}
              value={projectVal}
              onChange={(e) => {
                handleProjectData(e);
                setProjectVal();
              }}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  padding: "5px",
                  outline: "none",
                  boxShadow: "none",
                  marginLeft: "40px",
                  width: "200px",
                }),
              }}
              className="role-type-select"
              classNamePrefix="select"
            />
          )}
      </Flex>

      <HStack spacing={{ base: "8px", md: "21px" }} pos={"relative"}>
        <HStack paddingLeft="20px" spacing={{ base: "20px", md: "40px" }}>
          {/*<Box cursor="pointer">*/}
          {/*  <Notification />*/}
          {/*</Box>*/}

          {/* <Box cursor="pointer">
            <Message />
          </Box> */}

          <Avatar
            src={user?.logo}
            name={user?.name || user?.companyName || user?.contactName}
            size={["md", "lg"]}
            cursor="pointer"
            onClick={() =>
              history.push(
                `/${userInfo?.data?.userType
                  ?.toLowerCase()
                  .replaceAll("_", "-")}/settings`,
              )
            }
          />
        </HStack>
        {!isLessThan768 && (
          <Box textAlign="left">
            <Text fontSize="16px" fontWeight="600" style={{ margin: 0 }}>
              {user?.userName}
            </Text>
            <Text fontSize="13px" style={{ margin: 0 }}>
              {user?.email || user?.contactEmail || "jonathan@Fund Manager.com"}
            </Text>
            <Box
              cursor={"pointer"}
              onClick={() =>
                history.push(
                  `/${userInfo?.data?.userType
                    ?.toLowerCase()
                    .replaceAll("_", "-")}/settings`,
                )
              }
              bg="rgba(245, 133, 44, 0.08)"
              color="#F5852C"
              p="4px 10px"
              borderRadius="4px"
              mt="4px"
              width="fit-content"
              textTransform="capitalize"
            >
              {lowerCase(user?.userType.replaceAll("_", " ")) || "Builder"}
            </Box>
          </Box>
        )}
        <Menu>
          <MenuButton as="button">
            <Flex
              align="center"
              bg="rgba(18, 53, 90, 0.08)"
              w="24px"
              h="24px"
              borderRadius="100%"
              ml="auto"
              justifyContent="center"
            >
              <Icon
                transition={"0.3s ease"}
                as={HiChevronDown}
                size={16}
                display="block"
              />
            </Flex>
          </MenuButton>
          <MenuList p="24px">
            <Box pb="0">
              <Flex>
                <Avatar
                  src={user?.logo}
                  name={user?.name || user?.companyName || user?.contactName}
                  size={["md", "lg"]}
                  cursor="pointer"
                  onClick={() =>
                    history.push(
                      `/${userInfo?.data?.userType
                        ?.toLowerCase()
                        .replaceAll("_", "-")}/settings`,
                    )
                  }
                />
                <Box textAlign="left" ml="8px">
                  <Text fontSize="16px" fontWeight="600" style={{ margin: 0 }}>
                    {user?.userName}
                  </Text>
                  <Text fontSize="13px" style={{ margin: 0 }}>
                    {user?.email ||
                      user?.contactEmail ||
                      "jonathan@Fund Manager.com"}
                  </Text>

                  <Box
                    as="button"
                    onClick={() =>
                      history.push(
                        `/${
                          userInfo?.data?.userType?.toLowerCase() === "supplier"
                            ? "vendor"
                            : userInfo?.data?.userType
                                ?.toLowerCase()
                                .replaceAll("_", "-")
                        }/settings`,
                      )
                    }
                    bg="#F5852C"
                    color="#fff"
                    p="4px 10px"
                    borderRadius="4px"
                    mt="4px"
                    width="fit-content"
                  >
                    Edit Profile
                  </Box>
                </Box>
              </Flex>
              <Box as="hr" my="24px" />
            </Box>

            <MenuItem
              color="#666"
              onClick={() =>
                history.push(
                  `/${
                    userInfo?.data?.userType?.toLowerCase() === "supplier"
                      ? "vendor"
                      : userInfo?.data?.userType
                          ?.toLowerCase()
                          .replaceAll("_", "-")
                  }/settings`,
                )
              }
              mb="40px"
              p="0"
              _focus={{ bg: "none" }}
            >
              <IoMdSettings size="24px" />
              <Text fontSize="16px" fontWeight="600" ml="8px">
                Settings
              </Text>
            </MenuItem>

            <MenuItem color="#C43C25" mb="40px" p="0" _focus={{ bg: "none" }}>
              <Box transform="rotate(180deg)">
                <HiOutlineLogout size="24px" />
              </Box>

              <Text
                fontSize="16px"
                onClick={logoutHandle}
                fontWeight="600"
                ml="8px"
              >
                Logout
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}
