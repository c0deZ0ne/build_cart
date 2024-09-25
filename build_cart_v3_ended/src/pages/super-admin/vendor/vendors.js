import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import { Avatar, Box, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import Cards from "../../../components/Cards/Cards";
import TeamIcon from "../../../components/Icons/Team";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../components/EmptyState";
import BaseTable from "../../../components/Table";
import UserOctagon from "../../../components/Icons/UserOctagon";
import { useGetAllVendorsQuery } from "../../../redux/api/super-admin/vendorSlice";
import moment from "moment";
import { IoIosArrowForward } from "react-icons/io";
import {
  useGetAllProcurementManagerQuery,
  useGetAllRolesQuery,
} from "../../../redux/api/super-admin/utilitySlice";
import { handleError } from "../../../utility/helpers";
import SelectProcurementManager from "../../../components/selectProcurementManager";
import CreateVendor from "./components/createVendor";
import SupportVendor from "./components/SupportVendor";
import VendorProfile from "./components/VendorProfile";
// import BuilderProfile from "./components/builderProfile";
// import FundManagerProfile from "./components/fundManagerProfile";

export default function SuperAdminVendors() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [procurementRoleId, setProcurementRoleId] = useState(null);
  const [skip, setSkipRole] = useState(true);
  const [procurementManagersList, setProcurementManagersList] = useState(null);
  const [onSupportOpen, setOnSupportOpen] = useState(false);
  const [vendorToSupport, setVendorToSupport] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hideSupport, setHideSupport] = useState(false);

  const {
    data: VendorsTable,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetAllVendorsQuery();

  const { data: roles } = useGetAllRolesQuery();
  const { data: procurementManagers } = useGetAllProcurementManagerQuery(
    procurementRoleId,
    { skip }
  );

  useEffect(() => {
    if (roles) {
      const procurementRole = roles?.data.find(
        (role) => role.name === "PROCUREMENT MANAGER"
      );
      setProcurementRoleId(procurementRole.id);
      setSkipRole(false);
    }
  }, [roles]);

  useEffect(() => {
    if (procurementManagers) {
      setProcurementManagersList(procurementManagers.data);
    }
  }, [procurementManagers]);

  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "BUSINESS NAME",
    "PHONE NUMBER",
    "COMPLETED ORDERS",
    "LAST LOGIN",
    "ACTION",
    "",
  ];

  const titleCard = {
    name: "Vendor",
    icon: <TeamIcon fill="#12355A" opacity="1" />,
    quantity: VendorsTable?.total,
  };

  const supportBuilder = (builder) => {
    setVendorToSupport(builder);
    setOnSupportOpen(true);
    setHideSupport(false);
  };

  const showVendorProfile = (builder) => {
    setVendorToSupport(builder);
    setProfileOpen(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (VendorsTable && procurementManagersList) {
      const tableList = VendorsTable?.data?.map((vendor) => {
        return {
          logo: <Avatar src={vendor.logo} />,
          businessName: vendor.businessName,
          phoneNumber: vendor.phone,
          projectCompleted: vendor?.orders.length || 0,
          // procurementManager: (
          //   <SelectProcurementManager
          //     userData={vendor}
          //     procurementManagers={procurementManagersList}
          //     refetch={refetch}
          //     userType="vendor"
          //   />
          // ),
          lastLogin: moment(vendor?.lastLogin).format("DD-MM-YYYY"),
          actions: (
            <Box
              bg="rgba(7, 71, 148, 0.16)"
              color="#074794"
              px="22px"
              py="6px"
              borderRadius="4px"
              fontWeight="600"
              cursor="pointer"
              as="button"
              onClick={() => supportBuilder(vendor)}
            >
              Support
            </Box>
          ),
          anotherAction: (
            <Box onClick={() => showVendorProfile(vendor)}>
              <Flex align="center" cursor="pointer" color="#12355A">
                View profile
                <IoIosArrowForward />
              </Flex>
            </Box>
          ),
        };
      });
      setVendors(tableList);
    }

    if (isError) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VendorsTable, isLoading, procurementManagersList]);

  function searchTable() {
    const searchResult = vendors.filter((el) => {
      if (!el?.businessName) return vendors;
      return el?.businessName?.toLowerCase().match(search.toLowerCase());
    });

    return searchResult;
  }

  return (
    <DashboardWrapper pageTitle="Vendors">
      <Box>
        <Flex justify="space-between" mb="24px">
          <Cards cardDetail={titleCard} width="342px" h="128px" />
          <Box>
            <Button
              type="button"
              fontWeight="600"
              width={{ base: "180px", md: "242px" }}
              background="#F5852C"
              onClick={onOpen}
            >
              Create Vendor
            </Button>
          </Box>
        </Flex>

        <Box bgColor="rgba(245, 133, 44, 0.04)" pt="16px">
          <Box w={{ base: "100%", md: "462px" }} ml="auto" mb="24px">
            <Input
              placeholder="Search for fund manager"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
          {vendors.length === 0 ? (
            <Box
              boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
              borderRadius="8px"
              bg="#fff"
              h="470px"
            >
              <EmptyState>
                <Text>
                  There are no{" "}
                  <Text as="span" color="#F5852C">
                    Vendors
                  </Text>{" "}
                  on the platform.
                </Text>
              </EmptyState>
            </Box>
          ) : (
            <Box bg="#fff" borderRadius="8px" my="30px">
              <BaseTable
                tableColumn={tableColumn}
                tableBody={searchTable()}
                isLoading={isLoading}
              />
            </Box>
          )}
        </Box>

        <CreateVendor isOpen={isOpen} onClose={onClose} refetch={refetch} />
        <SupportVendor
          isOpen={onSupportOpen}
          onClose={setOnSupportOpen}
          vendor={vendorToSupport}
          setHideSupport={setHideSupport}
          hideSupport={hideSupport}
          refetch={refetch}
        />
        {profileOpen && (
          <VendorProfile
            vendor={vendorToSupport}
            setProfileOpen={setProfileOpen}
          />
        )}
      </Box>
    </DashboardWrapper>
  );
}
