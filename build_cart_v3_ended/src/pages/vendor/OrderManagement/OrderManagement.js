import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaClipboard } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";
import Cards from "../../../components/Cards/Cards";
import Input from "../../../components/Input";
import CustomTabs from "../../../components/Tabs/CustomTabs";
import ActiveOrdersList from "../../../components/Vendors/ActiveOrdersList";
import CompletedOrdersList from "../../../components/Vendors/CompletedOrdersList";
import OrderDisputesList from "../../../components/Vendors/OrderDisputesList";
import UnfulfilledOrdersList from "../../../components/Vendors/UnfulfilledOrdersList";
import { useQueryParams } from "../../../hook/useQueryParams";
import DashboardWrapper from "../../../layouts/dashboard";
import { addTransparency } from "../../../utility/helpers";

const OrderManagement = () => {
  const tabs = [
    { title: "Unfulfilled Orders" },
    { title: "Active Orders" },
    { title: "Completed Orders" },
    { title: "Order Disputes" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);

  const [detail, setDetail] = useState({
    name: "Total number of orders",
    quantity: 0,
    icon: <FaClipboard fill="#12355A" />,
    bg: "#12355A",
    description:
      "This represents the total number of orders you've received from buyers.",
    info: true,
  });

  const query = useQueryParams();

  useEffect(() => {
    const tabToGo = () => {
      const tab = query.get("tab");
      if (!tab) return;

      const queryTab = tabs.find((t) =>
        t.title.toLowerCase().includes(tab.toLowerCase())
      );

      if (queryTab) {
        setActiveTab(queryTab.title);
      }
    };

    tabToGo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    setDetail((prevDetail) => ({
      ...prevDetail,
      name: activeTab,
      quantity: count,
    }));
  }, [activeTab, count]);

  return (
    <DashboardWrapper pageTitle="Order">
      <Box width={"100%"} maxWidth={"320px"}>
        <Cards cardDetail={detail} h="100%" bottom="38px" />
      </Box>

      <Box
        mt={"40px"}
        p={"40px 24px"}
        borderRadius="8px"
        backgroundColor={addTransparency("#f5852c", 0.04)}
      >
        <Box>
          <Text color={"#F5852C"} fontWeight={600} fontSize={"20px"}>
            Order Management
          </Text>
          <Text color={"#12355A"} fontSize={"12px"}>
            Manage all your orders in one place - including active, completed,
            and disputed orders.
          </Text>
        </Box>
        <Flex
          justifyContent={"space-between"}
          gap={"24px"}
          my={"24px"}
          wrap={"wrap"}
        >
          <Box overflow={"auto"}>
            <CustomTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Box>

          <Box>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
        </Flex>

        <Box backgroundColor={"#fff"}>
          {activeTab === "Unfulfilled Orders" && (
            <UnfulfilledOrdersList
              searchTerm={searchTerm}
              setCount={setCount}
            />
          )}
          {activeTab === "Active Orders" && (
            <ActiveOrdersList searchTerm={searchTerm} setCount={setCount} />
          )}
          {activeTab === "Completed Orders" && (
            <CompletedOrdersList searchTerm={searchTerm} setCount={setCount} />
          )}
          {activeTab === "Order Disputes" && (
            <OrderDisputesList searchTerm={searchTerm} setCount={setCount} />
          )}
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default OrderManagement;
