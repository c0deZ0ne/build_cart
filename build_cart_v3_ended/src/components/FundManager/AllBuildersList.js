import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useRetrieveAllBuildersQuery } from "../../redux/api/fundManager/fundManager";
import EmptyState from "../EmptyState";
import UserOctagon from "../Icons/UserOctagon";
import StarRatings from "../StarRatings";
import BaseTable from "../Table";

const tableColumns = [
  { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
  "NAME",
  "BUSINESS SIZE",
  "BUILDER CATEGORY",
  "COMPLETED PROJECTS",
  "LOCATION",
  "RATINGS",
  "ACTION",
];

/**
 *
 * @param {{searchTerm: string}} props
 * @returns
 */
const AllBuildersList = ({ searchTerm }) => {
  const { data, isLoading } = useRetrieveAllBuildersQuery(searchTerm);

  const mappedBuilders = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    return data.data.builders.map((d) => {
      const {
        name,
        businessSize,
        completedProjectCount,
        location,
        builderCategory,
        ratings,
        BuilderId,
      } = d;

      return {
        IMAGE: (
          <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
            <Avatar name={name} height={"40px"} width={"40px"} />
          </Box>
        ),
        NAME: name,
        "BUSINESS SIZE": businessSize,
        "BUILDER CATEGORY": builderCategory,
        "COMPLETED PROJECTS": completedProjectCount,
        LOCATION: location,
        RATINGS: <StarRatings rating={ratings} />,
        ACTION: (
          <Box ml={"-24px"}>
            <Link to={`/fund-manager/builders/${BuilderId}`}>
              <Flex align="center" cursor="pointer" color="#12355A">
                View Profile <IoIosArrowForward />
              </Flex>
            </Link>
          </Box>
        ),
      };
    });
  }, [data]);

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={mappedBuilders}
        isLoading={isLoading}
        empty={
          <EmptyState>
            <Text>
              You've not transacted with any builders yet. When you complete
              your first transaction,{" "}
              <Text as="span" color="primary">
                {" "}
                builders will appear here{" "}
              </Text>
              . To invite a builder,{" "}
              <Text as="span" color="secondary">
                {" "}
                click the "Invite Builder"{" "}
              </Text>{" "}
              button in the upper right corner of your screen.
            </Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default AllBuildersList;
