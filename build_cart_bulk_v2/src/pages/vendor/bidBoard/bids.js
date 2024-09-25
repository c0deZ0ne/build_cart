import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Cards from "../../../components/Cards/Cards";
import ProjectInvitationIcon from "../../../components/Icons/ProjectInvitation";
import Input from "../../../components/Input";
import Tabs from "../../../components/Tabs/Tabs";
import DashboardWrapper from "../../../layouts/dashboard";
import instance from "../../../utility/webservices";
import AllRfq from "./allRfq";
import PurchaseOrder from "./purchaseOrder";
import SubmittedBids from "./submittedBids";

const BidBoard = () => {
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
      description:
        "This represents the total number of RFQs you have received from buyers",
      info: true,
      name: "Total RFQ's Recieved",
      quantity: rfqCount ?? 0,
      icon: <ProjectInvitationIcon fill="#12355A" opacity="1" />,
      heading: "All Request for Quotes (RFQs)",
      subHeading:
        "These are all the Request for Quotes (RFQs) that have been sent by multiple builders.",
    },
    {
      description:
        "This represents the total number of RFQs you have received from buyers",
      info: true,
      name: "Bids Submitted",
      quantity: submittedCount ?? 0,
      icon: <ProjectInvitationIcon fill="#12355A" opacity="1" />,
      heading: "Submitted Bids",
      subHeading:
        "These are all the Bids you have submitted to various buyers.",
    },
    {
      description:
        "This represents the total number of RFQs you have received from buyers",
      info: true,
      name: "Purchase Orders",
      quantity: POCount ?? 0,
      icon: <ProjectInvitationIcon fill="#12355A" opacity="1" />,
      heading: "Purchase Orders",
      subHeading:
        "These are all the Purchase Orders (PO) that have been submitted by buyers",
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
      { title: "All RFQs" },
      { title: "Submitted Bids" },
      { title: "Purchase Order" },
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

  return (
    <DashboardWrapper pageTitle="Bids">
      <Flex direction={["column", "row"]} gap={3}>
        <Cards cardDetail={cardDetail[defaultIndex]} width="300px" />
      </Flex>
      <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
        <Box fontSize="22px">
          <Text fontWeight="600" color="secondary">
            {cardDetail[defaultIndex]?.heading}
          </Text>
          <Text fontSize="14px">{cardDetail[defaultIndex]?.subHeading}</Text>
        </Box>

        <Box mt="20px">
          <Tabs
            panelPx={"0"}
            tabsData={tabsArray}
            defaultIndex={defaultIndex}
            setDefaultIndex={setDefaultIndex}
          >
            <Box width="max-content" position={"relative"}>
              <Flex gap={"1rem"}>
                <Input
                  placeholder="Search by name or item"
                  value={searchTerm}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                    setSearchTerm(e.target.value ?? "");
                  }}
                  //   onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<RiSearch2Line />}
                />
              </Flex>
            </Box>
          </Tabs>
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default BidBoard;
