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
import { useGetAllFundManagersQuery } from "../../../redux/api/super-admin/fundManagerSlice";
import moment from "moment";
import { IoIosArrowForward } from "react-icons/io";
import {
  useGetAllProcurementManagerQuery,
  useGetAllRolesQuery,
} from "../../../redux/api/super-admin/utilitySlice";
import { handleError } from "../../../utility/helpers";
import SelectProcurementManager from "../../../components/selectProcurementManager";
import CreateFundManager from "./components/createFundManager";
import SupportFundManager from "./components/SupportFundManager";
import FundManagerProfile from "./components/fundManagerProfile";

export default function SuperAdminFundManagers() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [fundManagers, setFundManagers] = useState([]);
  const [procurementRoleId, setProcurementRoleId] = useState(null);
  const [skip, setSkipRole] = useState(true);
  const [procurementManagersList, setProcurementManagersList] = useState(null);
  const [onSupportOpen, setOnSupportOpen] = useState(false);
  const [fundManagerToSupport, setFundManagerToSupport] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hideSupport, setHideSupport] = useState(false);

  const {
    data: fundManagerTable,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetAllFundManagersQuery();

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
    "PROJECTS COMPLETED",
    "LAST LOGIN",
    "ACTION",
    "",
  ];

  const titleCard = {
    name: "Fund Managers",
    icon: <TeamIcon fill="#12355A" opacity="1" />,
    quantity: fundManagerTable?.total,
  };

  const supportFundManager = (fundManager) => {
    setFundManagerToSupport(fundManager);
    setOnSupportOpen(true);
    setHideSupport(false);
  };

  const showFundManagerProfile = (fundManager) => {
    setFundManagerToSupport(fundManager);
    setProfileOpen(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (fundManagerTable && procurementManagersList) {
      const tableList = fundManagerTable?.data?.map((fundManager) => {
        return {
          logo: <Avatar src={fundManager.logo} />,
          businessName: fundManager.businessName,
          phoneNumber: fundManager.phone,
          projectCompleted: fundManager?.completedProjects || 0,
          // procurementManager: (
          //   <SelectProcurementManager
          //     userData={fundManager}
          //     procurementManagers={procurementManagersList}
          //     refetch={refetch}
          //     userType="fundManager"
          //   />
          // ),
          lastLogin: moment(fundManager?.lastLogin).format("DD-MM-YYYY"),
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
              onClick={() => supportFundManager(fundManager)}
            >
              Support
            </Box>
          ),
          anotherAction: (
            <Box onClick={() => showFundManagerProfile(fundManager)}>
              <Flex align="center" cursor="pointer" color="#12355A">
                View profile
                <IoIosArrowForward />
              </Flex>
            </Box>
          ),
        };
      });
      setFundManagers(tableList);
    }

    if (isError) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundManagerTable, isLoading, procurementManagersList]);

  function searchTable() {
    const searchResult = fundManagers.filter((el) => {
      return el?.businessName?.toLowerCase().match(search.toLowerCase());
    });

    return searchResult;
  }

  return (
    <DashboardWrapper pageTitle="Fund Managers">
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
              Create Fund Manager
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
          {fundManagers.length === 0 ? (
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
                    Fund Managers
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

        <CreateFundManager
          isOpen={isOpen}
          onClose={onClose}
          refetch={refetch}
        />
        {onSupportOpen && (
          <SupportFundManager
            isOpen={onSupportOpen}
            onClose={setOnSupportOpen}
            fundManager={fundManagerToSupport}
            setHideSupport={setHideSupport}
            hideSupport={hideSupport}
          />
        )}

        {profileOpen && (
          <FundManagerProfile
            fundManager={fundManagerToSupport}
            setProfileOpen={setProfileOpen}
          />
        )}
      </Box>
    </DashboardWrapper>
  );
}
