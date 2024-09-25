import { Box, Flex, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import StatusPill from "../../../components/Builder/ProjectInvitations/StatusPill";
import { useGetFundManagerProjectsQuery } from "../../../redux/api/builder/builder";
import EmptyState from "../../EmptyState";
import BaseTable from "../../Table";

const FundManagerProjectsList = ({ fundManagerId, searchTerm }) => {
  const columns = [
    "S/N",
    "PROJECT NAME",
    "LOCATION",
    "DURATION",
    "BIDS",
    "STATUS",
    "DATE CREATED",
    "ACTION",
  ];

  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetFundManagerProjectsQuery(
    {
      id: fundManagerId,
      searchTerm: search,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    return data.data.map((d, idx) => {
      const statusColor = (() => {
        const status = d.project.status;
        if (status === "active") return "#074794";
        else if (status === "pending") return "#FFBD00";
        else if (status === "dispute") return "#C43C25";
        else if (status === "completed") return "#1C903D";
        return "#c47151";
      })();

      return {
        "S/N": idx < 10 ? `0${idx}` : idx,
        "PROJECT NAME": d.project.title,
        LOCATION: d.project.location,
        DURATION: d.project.duration,
        BIDS: d.project.tenderbids.bidCount,
        STATUS: (
          <StatusPill
            color={statusColor}
            status={capitalize(d.project.status)}
          />
        ),
        "DATE CREATED": d.project.startDate,
        ACTION: (
          <Link
            to={`/builder/fund-manager/${fundManagerId}/projects/${d.ProjectId}`}
          >
            <Flex align="center" cursor="pointer" color="#12355A">
              View <IoIosArrowForward />
            </Flex>
          </Link>
        ),
      };
    });
  }, [data, fundManagerId]);

  return (
    <BaseTable
      tableBody={tableData}
      tableColumn={columns}
      isLoading={isLoading}
      empty={
        <EmptyState>
          <Box py={"40px"}>
            <Text>No copy here...</Text>
          </Box>
        </EmptyState>
      }
    />
  );
};

export default FundManagerProjectsList;
