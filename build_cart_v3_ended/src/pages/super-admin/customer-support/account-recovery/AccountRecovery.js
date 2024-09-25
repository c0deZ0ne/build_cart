import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import Cards from "../../../../components/Cards/Cards";
import Input from "../../../../components/Input";
import Tabs from "../../../../components/Tabs/Tabs";
import DashboardWrapper from "../../../../layouts/dashboard";
import instance from "../../../../utility/webservices";
import TeamIcon from "../../../../components/Icons/Team";
import Button from "../../../../components/Button";
import OpenRequest from "./components/OpenRequests";
import CompletedRequest from "./components/CompletedRequest";
// import openRequest from "./components/openRequest";
// import OngoingDispute from "./components/OngoingDispute";
// import completedRequest from "./components/CompleteDispute";

const AccountRecovery = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [openRequest, setOpenRequest] = useState([]);
  const [completedRequest, setCompletedRequest] = useState([]);

  const cardDetail = [
    {
      name: "Open Requests",
      quantity: openRequest.length ?? 0,
      icon: <TeamIcon fill="#12355A" opacity="1" />,
    },
    {
      name: "Completed Resolution",
      quantity: completedRequest.length ?? 0,
      icon: <TeamIcon fill="#12355A" opacity="1" />,
    },
  ];

  const getAllRequest = async (search) => {
    setIsLoading(true);
    let url = `/support-recovery/all/request?page_size=100`;
    try {
      const { data } = await instance.get(url);
      const open = data?.data.filter((el) => el.status === "OPEN");
      const completed = data?.data.filter(
        (el) => el.status === "COMPLETED" || el.status === "RESOLVED"
      );
      setOpenRequest(open);
      setCompletedRequest(completed);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabsArray = {
    headers: [{ title: "Open Requests" }, { title: "Completed Requests" }],
    body: [
      <OpenRequest
        data={openRequest}
        getAllRequest={getAllRequest}
        isLoading={isLoading}
      />,
      <CompletedRequest
        data={completedRequest}
        getAllRequest={getAllRequest}
        isLoading={isLoading}
      />,
    ],
  };

  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();

  return (
    <DashboardWrapper pageTitle="Dispute Resolution">
      <Flex direction={["column", "row"]} gap={3}>
        <Cards cardDetail={cardDetail[defaultIndex]} width="300px" />
      </Flex>

      <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
        <Box mt="20px">
          <Tabs
            panelPx={"0"}
            tabsData={tabsArray}
            defaultIndex={defaultIndex}
            setDefaultIndex={setDefaultIndex}
          >
            <Flex gap={"1rem"}>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                leftIcon={<RiSearch2Line />}
                width="200px"
              />

              <Box>
                <Menu
                  isOpen={isOpenMenu}
                  onOpen={onOpenMenu}
                  onClose={onCloseMenu}
                  closeOnSelect={false}
                  isLazy
                  direction="ltr"
                >
                  <MenuButton as="div" style={{ cursor: "pointer" }}>
                    <Button leftIcon={<RiFilter2Fill />}>Filter</Button>
                  </MenuButton>
                  <MenuList>
                    <Box p="10px" fontWeight="600" fontSize="14px">
                      <Text>Filter</Text>
                    </Box>
                    <Box m="0px 10px" fontSize="14px">
                      <Text>From</Text>
                    </Box>
                    <MenuItem>
                      <Input type="date" placeholder="Start date" />
                    </MenuItem>
                    <Box m="0px 10px" fontSize="14px">
                      <Text>To</Text>
                    </Box>
                    <MenuItem>
                      <Input type="date" placeholder="Start date" />
                    </MenuItem>

                    <Box p="10px">
                      <Button full>Apply</Button>
                    </Box>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
          </Tabs>
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default AccountRecovery;
