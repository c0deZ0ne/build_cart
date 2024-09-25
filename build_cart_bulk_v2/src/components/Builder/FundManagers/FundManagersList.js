import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useGetMyFundManagersQuery } from "../../../redux/api/builder/builder";
import EmptyState from "../../EmptyState";
import UserOctagon from "../../Icons/UserOctagon";
import BaseTable from "../../Table";

const FundManagersList = ({ searchTerm, setTotal }) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetMyFundManagersQuery(search, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!data) return;
    if (!data.data) return;

    const total = data.data.totalFundManagersLength;
    setTotal(total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "BUSINESS NAME",
    "BUSINESS ADDRESS",
    "PROJECTS COMPLETED",
    "ACTION",
  ];

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    return data.data.FundManagers.map((d) => {
      const { FundManager, completedProjectsCount, FundManagerId } = d;
      const { businessAddress, businessName, logo } = FundManager;
      return {
        IMAGE: (
          <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
            <Image src={logo} />
          </Box>
        ),
        "BUSINESS NAME": businessName,
        "BUSINESS ADDRESS": businessAddress,
        "PROJECTS COMPLETED": completedProjectsCount,
        ACTION: (
          <Link to={`/builder/fund-manager/${FundManagerId}`}>
            <Flex align="center" cursor="pointer" color="#12355A">
              View <IoIosArrowForward />
            </Flex>
          </Link>
        ),
      };
    });
  }, [data]);

  return tableData.length ? (
    <>
      <BaseTable
        tableBody={tableData}
        tableColumn={columns}
        isLoading={isLoading}
      />
    </>
  ) : (
    <Box py={"40px"}>
      <EmptyState>
        Your company does not oversee any
        <Text as={"span"} color={"primary"}>
          {" "}
          projects for institutions or fund managers.{" "}
        </Text>
        Projects managed for institutions and fund managers will be shown here
        when created. To invite a financier, click the
        <Text as={"span"} color={"secondary"}>
          {" "}
          "Invite a Fund Manager"{" "}
        </Text>
        button in the top right corner of your screen.
      </EmptyState>
    </Box>
  );
};

export default FundManagersList;
