import {
  Box,
  Button as ChakraButton, Card,
  Checkbox,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Button from "../../../components/Button";
import CustomCheckBoxIcon from "../../../components/Checkmark/CustomCheckBox";
import EmptyState from "../../../components/EmptyState";
import Input from "../../../components/Input";
import StarRatings from "../../../components/StarRatings";
import BaseTable from "../../../components/Table";
import CustomTabs from "../../../components/Tabs/CustomTabs";
import InviteVendorForm from "../../../components/Vendors/InviteVendorForm";
import DashboardWrapper from "../../../layouts/dashboard";

import {
  useGetMyVendorsQuery,
  useGetVendorsQuery,
} from "../../../redux/api/builder/builder";
import TopCards from "../projects/components/TopCards";
import Cards from "../../../components/Cards/Cards";
import {IoCheckmarkCircle} from "react-icons/io5";

const tableColumns = [
  "NAME",
  "USER TYPE",
  "SUPPLIER CATEGORY",
  "COMPLETED ORDERS",
  "LOCATION",
  "RATINGS",
  "ACTION",
];

/**
 *
 * @param {{searchTerm: string, setNumberOfVendors: (num: number) => void}} Props
 * @returns
 */
const AllVendorsTable = ({ searchTerm, setNumberOfVendors }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useGetVendorsQuery(search, {
    refetchOnMountOrArgChange: true,
  });

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.data.map((v) => {
      return {
        name: v.name,
        "USER TYPE": capitalize(v.vendorType),
        "SUPPLIER CATEGORY": v.vendorCategory[0].title,
        "COMPLETED ORDERS": v.completedProjectCount,
        LOCATION: v.location,
        RATINGS: <StarRatings rating={v.rating} />,
        ACTION: (
          <Link to={`/builder/vendors/${v.id}`}>
            <Flex align="center" cursor="pointer" color="#12355A">
              View <IoIosArrowForward />
            </Flex>
          </Link>
        ),
      };
    });
  }, [data]);

  useEffect(() => {
    setNumberOfVendors(tableData.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData.length]);

  return (
    <BaseTable
      isLoading={isLoading}
      tableBody={tableData}
      tableColumn={tableColumns}
      empty={
        <EmptyState>
          <Text>
            You've not transacted with any manufacturer or distributor yet. When
            you complete your first transaction,{" "}
            <Text as="span" color="#12355A">
              vendors will appear here.{" "}
            </Text>
            To invite a supplier,
            <Text as="span" color="secondary">
              click the "Invite Supplier" button in the upper{" "}
            </Text>
            right corner of your screen.{" "}
          </Text>{" "}
        </EmptyState>
      }
    />
  );
};

/**
 *
 * @param {{searchTerm: string, setNumberOfVendors: (num: number) => void}} Props
 * @returns
 */
const MyVendorsTable = ({ searchTerm, setNumberOfVendors }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useGetMyVendorsQuery(search, {
    refetchOnMountOrArgChange: true,
  });

  const tableData = useMemo(() => {
    if (!data) return [];

    return data.data.map((v) => {
      return {
        name: v.name,
        "USER TYPE": capitalize(v.vendorType),
        "SUPPLIER CATEGORY": v.vendorCategory[0].title,
        "COMPLETED ORDERS": v.completedProjectCount,
        LOCATION: v.location,
        RATINGS: <StarRatings rating={v.rating} />,
        ACTION: (
          <Link to={`/builder/vendors/${v.id}`}>
            <Flex align="center" cursor="pointer" color="#12355A">
              View <IoIosArrowForward />
            </Flex>
          </Link>
        ),
      };
    });
  }, [data]);

  useEffect(() => {
    setNumberOfVendors(tableData.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData.length]);

  return (
    <BaseTable
      isLoading={isLoading}
      tableBody={tableData}
      tableColumn={tableColumns}
      empty={
        <EmptyState>
          <Text>
            You 've not transacted with any manufacturer or distributor yet.
            When you complete your first transaction,{" "}
            <Text as="span" color="#12355A">
              vendors will appear here.{" "}
            </Text>
            To invite a supplier,
            <Text as="span" color="secondary">
              click the "Invite Supplier" button in the upper{" "}
            </Text>
            right corner of your screen.{" "}
          </Text>{" "}
        </EmptyState>
      }
    />
  );
};

/**
 * * @typedef {{cement: boolean,aggregate: boolean,manufacturer: boolean, distributor: boolean, location: boolean, rating: boolean }} Filters
 */

/**
 *
 * @param {{setFilters: Function(filters: Filters)}} param0
 * @returns
 */
const Filters = ({ setFilters }) => {
  const [generalFilters, setGeneralFilters] = useState({
    location: false,
    rating: false,
  });
  const [userTypeFilter, setUserTypeFilter] = useState({
    manufacturer: false,
    distributor: false,
  });
  const [categoryFilter, setCategoryFilter] = useState({
    cement: false,
    aggregate: false,
  });

  const filters = useMemo(() => {
    return { ...userTypeFilter, ...categoryFilter, ...generalFilters };
  }, [categoryFilter, generalFilters, userTypeFilter]);

  function resetFilters() {
    setUserTypeFilter({ distributor: false, manufacturer: false });
    setCategoryFilter({ aggregate: false, cement: false });
    setGeneralFilters({ location: false, rating: false });
  }

  return (
    <Popover placement="auto">
      <PopoverTrigger>
        <Box
          as={"button"}
          height={"48px"}
          backgroundColor={"primary"}
          color={"white"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"16px"}
          p={"12px"}
          borderRadius={"8px"}
          fontWeight={700}
          fontSize={"14px"}
        >
          <RiFilter2Fill />
          Filter{" "}
        </Box>
      </PopoverTrigger>
      <PopoverContent px="16px" pt="16px" pb={"28px"}>
        <PopoverBody>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Text fontSize={"12px"} color={"#999"}>
              Filter by
            </Text>
            <ChakraButton
              onClick={resetFilters}
              variant="ghost"
              color="primary"
              size="xs"
              border={0}
              p="0"
            >
              Clear All
            </ChakraButton>
          </Flex>

          <VStack gap="24px" width={"100%"} mt={"24px"}>
            <VStack spacing="16px" width={"100%"}>
              {Object.entries(generalFilters).map(([key, value]) => {
                return (
                  <Flex
                    key={key}
                    justifyContent="space-between"
                    alignItems="center"
                    width={"100%"}
                  >
                    <Text color={"#333"} textTransform={"capitalize"}>
                      {key}
                    </Text>
                    <Checkbox
                      onChange={() =>
                        setGeneralFilters({ ...generalFilters, [key]: !value })
                      }
                      isChecked={value}
                      colorScheme="primary"
                      size="lg"
                      icon={<CustomCheckBoxIcon />}
                    ></Checkbox>
                  </Flex>
                );
              })}
            </VStack>

            <Box width={"100%"}>
              <Text fontSize={"12px"} fontWeight={600}>
                User Type
              </Text>

              <VStack spacing="16px" mt="8px">
                {/* <Box width={"100%"}> */}

                {Object.entries(userTypeFilter).map(([key, value]) => {
                  return (
                    <Flex
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text color={"#333"} textTransform={"capitalize"}>
                        {key}
                      </Text>
                      <Checkbox
                        onChange={(e) =>
                          setUserTypeFilter({
                            ...userTypeFilter,
                            [key]: !value,
                          })
                        }
                        isChecked={value}
                        colorScheme="primary"
                        size="lg"
                        icon={<CustomCheckBoxIcon />}
                      ></Checkbox>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            <Box width={"100%"}>
              <Text fontSize={"12px"} fontWeight={600}>
                Category{" "}
              </Text>

              <VStack spacing="16px" mt="8px">
                {Object.entries(categoryFilter).map(([key, value]) => {
                  return (
                    <Flex
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text color={"#333"} textTransform={"capitalize"}>
                        {key}
                      </Text>
                      <Checkbox
                        isChecked={value}
                        onChange={(e) =>
                          setCategoryFilter({
                            ...categoryFilter,
                            [key]: !value,
                          })
                        }
                        colorScheme="primary"
                        size="lg"
                        icon={<CustomCheckBoxIcon />}
                      ></Checkbox>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          </VStack>

          <Box mt={"40px"}>
            <Button fontWeight="600" full onClick={() => setFilters(filters)}>
              Apply
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const Vendors = () => {
  const tabs = [
    {
      title: "All Suppliers",
      info: "The table below contains the details of the suppliers on the cutstruct platform.",
    },
    {
      title: "My Suppliers",
      info: "Your favorite suppliers are listed here",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [searchTerm, setSearchTerm] = useState("");
  const [numberOfVendors, setNumberOfVendors] = useState(0);

  const [filters, setFilters] = useState({});

  const [openInviteForm, setOpenInviteForm] = useState(false);

  return (
    <DashboardWrapper
      pageTitle="Overview"
      handleProjectData=""
      projectOptions=""
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        gap={"1rem"}
        wrap={"wrap"}
      >

        <Cards cardDetail={{
          name: activeTab,
          icon: <IoCheckmarkCircle fontSize="24px" />,
          type: "all",
          quantity: numberOfVendors,
          description:
              "This is the total number of suppliers on the Cutstruct platform",
          info: "info"
        }} width="320px" />

        <Button fontWeight="700" onClick={() => setOpenInviteForm(true)}>
          {" "}
          Invite Supplier{" "}
        </Button>{" "}
      </Flex>{" "}

      <Box
        mt={"40px"}
        position={"relative"}
        borderRadius={"8px"}
        // overflow={"hidden"}
        p={"32px 24px"}
        background={"#FCF7F6"}
      >
        <Flex
          gap={"1rem"}
          justifyContent={"space-between"}
          direction={["column", "column", "row"]}
        >
          <Box width={"max-content"}>
            <CustomTabs
              activeTab={activeTab}
              tabs={tabs}
              setActiveTab={setActiveTab}
            />
          </Box>
          <Spacer />
          <Box width="max-content" position={"relative"}>
            <Flex gap={"1rem"}>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
              <Box hidden>
                <Filters setFilters={setFilters} />
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box backgroundColor="white" mt={"36px"}>
          {activeTab === "All Suppliers" ? (
            <AllVendorsTable
              searchTerm={searchTerm}
              setNumberOfVendors={(num) => setNumberOfVendors(num)}
            />
          ) : activeTab === "My Suppliers" ? (
            <MyVendorsTable
              searchTerm={searchTerm}
              setNumberOfVendors={(num) => setNumberOfVendors(num)}
            />
          ) : null}
        </Box>
      </Box>
      <InviteVendorForm
        isOpen={openInviteForm}
        closeModal={() => setOpenInviteForm(false)}
      />
    </DashboardWrapper>
  );
};

export default Vendors;
