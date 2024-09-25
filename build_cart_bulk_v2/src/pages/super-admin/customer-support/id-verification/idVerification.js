import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
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
import AllRfq from "./PendingVerification";
import PurchaseOrder from "./CompletedVerification";
import SubmittedBids from "./OngoingVerification";
import TeamIcon from "../../../../components/Icons/Team";
import Button from "../../../../components/Button";

import { MenuItemOption, MenuGroup, MenuOptionGroup } from "@chakra-ui/react";

const IdVerification = () => {
  const [isLoadingRfq, setLoadingRfq] = useState(true);
  const [isLoadingSubmitted, setLoadingSubmitted] = useState(true);
  const [isLoadingPO, setLoadingPO] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [rfqCount, setRfqCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [POCount, setPOCount] = useState(0);
  const [rfqData, setRfqData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [submittedBidData, setSubmittedBidData] = useState([]);
  //   const userAccount = JSON.parse(localStorage.getItem("userInfo"));

  const cardDetail = [
    {
      name: "Pending Verification",
      quantity: rfqCount ?? 0,
      icon: <TeamIcon fill="#12355A" opacity="1" />,
    },
    {
      name: "Ongoing Verification",
      quantity: submittedCount ?? 0,
      icon: <TeamIcon fill="#12355A" opacity="1" />,
    },
    {
      name: "Completed Verification",
      quantity: POCount ?? 0,
      icon: <TeamIcon fill="#12355A" opacity="1" />,
    },
  ];

  const handleSearch = (value) => {
    if (defaultIndex === 0) {
      if (value === "") {
        getRfqData();
      } else {
        getRfqData(value);
      }
    }

    if (defaultIndex === 1) {
      if (value === "") {
        getSubmittedBidData();
      } else {
        getSubmittedBidData(value);
      }
    }

    if (defaultIndex === 2) {
      if (value === "") {
        getPurchaseOrderData();
      } else {
        getPurchaseOrderData(value);
      }
    }
  };

  const getRfqData = async (search) => {
    setLoadingRfq(true);
    let url = `/vendor/bidboard/rfq/request?page_size=100`;
    if (search) {
      url = `/vendor/bidboard/rfq/request?search=${search}`;
    }
    try {
      const { data } = await instance.get(url);

      if (search) {
        setRfqData(data?.data);
      } else {
        setRfqData(data?.data);
        setRfqCount(data?.total);
      }
      setLoadingRfq(false);
    } catch (error) {
      console.log(error);
      setLoadingRfq(false);
    }
  };

  const getSubmittedBidData = async (search) => {
    setLoadingSubmitted(true);
    let url = `/vendor/bidboard/submitted`;
    if (search) {
      url = `/vendor/bidboard/submitted?search=${search}`;
    }
    try {
      const { data } = await instance.get(url);

      if (search) {
        setSubmittedBidData(data?.data);
      } else {
        setSubmittedBidData(data?.data);
        setSubmittedCount(data?.data?.totalLength);
      }
      setLoadingSubmitted(false);
    } catch (error) {
      console.log(error);
      setLoadingSubmitted(false);
    }
  };

  const getPurchaseOrderData = async (search) => {
    setLoadingPO(true);
    let url = `/vendor/bidboard/purchase-orders`;
    if (search) {
      url = `/vendor/bidboard/purchase-orders?search=${search}`;
    }
    try {
      const { data } = await instance.get(url);

      if (search) {
        setPurchaseOrderData(data?.data?.orders);
      } else {
        setPurchaseOrderData(data?.data?.orders);
        setPOCount(data?.data?.orders.length);
      }
      setLoadingPO(false);
    } catch (error) {
      console.log(error);
      setLoadingPO(false);
    }
  };

  const getAllBidData = async () => {
    await getRfqData();
    await getSubmittedBidData();
    await getPurchaseOrderData();
  };

  useEffect(() => {
    getAllBidData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabsArray = {
    headers: [
      { title: "Pending Verification" },
      { title: "Ongoing Verification" },
      { title: "Completed Verification" },
    ],
    body: [
      <AllRfq
        data={rfqData}
        setDefaultIndex={setDefaultIndex}
        getAllBidData={getAllBidData}
        isLoading={isLoadingRfq}
      />,
      <SubmittedBids
        data={submittedBidData}
        setDefaultIndex={setDefaultIndex}
        getAllBidData={getAllBidData}
        isLoading={isLoadingSubmitted}
      />,
      <PurchaseOrder
        data={purchaseOrderData}
        setDefaultIndex={setDefaultIndex}
        getAllBidData={getAllBidData}
        isLoading={isLoadingPO}
      />,
    ],
  };

  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();

  return (
    <DashboardWrapper pageTitle="ID Verification">
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

export default IdVerification;
