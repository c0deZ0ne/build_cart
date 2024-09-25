import {
  Box,
  Button as ChakraButton,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import EmptyState from "../../../../components/EmptyState";
import { useGetAcceptedTendersQuery } from "../../../../redux/api/builder/builder";
import UserOctagon from "../../../Icons/UserOctagon";
import BaseTable from "../../../Table";
import ProjectInvitationBidModal from "../ProjectInvitationBidModal";
import StatusPill from "../StatusPill";

const AcceptedBidsTable = () => {
  const [openBidModal, setOpenBidModal] = useState(!true);
  const [currentBidId, setCurrentBidId] = useState(null);
  const { data, isLoading } = useGetAcceptedTendersQuery();
  const tableColumns = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "FUND MANAGER",
    "PROJECT NAME",
    "TYPE",
    "BUDGET",
    "START DATE",
    "STATUS",
    "ACTION",
  ];

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    return data.data.map((d) => {
      const color = (() => {
        if (d.STATUS === "In-review") return "#FFBD00";
        else if (d.STATUS === "Closed") return "#C43C25";
        return "#12355A";
      })();

      return {
        IMAGE: (
          <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
            <Image src={d.logo} />
          </Box>
        ),
        "FUND MANAGER": d.fundManagerName,
        "PROJECT NAME": d.projectName,
        TYPE: capitalize(d.tenderType),
        BUDGET: Intl.NumberFormat("en-ng", {
          currency: "NGN",
          style: "currency",
        }).format(d.budget),
        LOCATION: d.location,
        "START DATE": d.startDate.split("T")[0],
        STATUS: <StatusPill status={d.status} color={color} />,
        ACTION: (
          <Flex ml={"-24px"}>
            <ChakraButton
              background="transparent"
              color="#12355a"
              fontWeight="400"
              onClick={() => {
                setCurrentBidId(d.id);
                setOpenBidModal(true);
              }}
            >
              <Flex align="center" cursor="pointer" color="#12355A">
                View <IoIosArrowForward />
              </Flex>
            </ChakraButton>
          </Flex>
        ),
      };
    });
  }, [data]);

  return tableData.length ? (
    <>
      {currentBidId && (
        <ProjectInvitationBidModal
          isOpen={openBidModal}
          closeModal={setOpenBidModal}
          bidId={currentBidId}
        />
      )}
      <BaseTable
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading}
        pointerCursor
      />
    </>
  ) : (
    <Box>
      <EmptyState>
        <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
          There are no
          <Text as="span" color="#12355A">
            {" "}
            accepted bids{" "}
          </Text>
          in your records at the moment.{" "}
          <Text as="span" color="secondary">
            Accepted bids from financiers{" "}
          </Text>
          will appear here once confirmed.
        </Text>
      </EmptyState>
    </Box>
  );
};

export default AcceptedBidsTable;
