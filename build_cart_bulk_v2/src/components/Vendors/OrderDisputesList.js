import { Box, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useGetDisputedOrdersQuery } from "../../redux/api/vendor/vendor";
import StatusPill from "../Builder/ProjectInvitations/StatusPill";
import Button from "../Button";
import EmptyState from "../EmptyState";
import BaseTable from "../Table";

const tableColumns = [
  "S/N",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "ESTIMATED DELIVERY",
  "STATUS",
  "ACTION",
];

/**
 *
 * @param {object} props
 * @param {string} props.searchTerm
 * @param {(num: number) => void} props.setCount
 * @returns
 */
const OrderDisputesList = ({ searchTerm, setCount }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data } = useGetDisputedOrdersQuery(search);

  const newTable = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    return data.data.orders.map((order, index) => {
      const {
        Contract,
        ContractId,
        deliverySchedules: schedules,
        RfqRequest,
        status,
      } = order;

      const { RfqQuote } = Contract;

      const { RfqRequestMaterial, deliveryDate } = RfqQuote;

      const { name } = RfqRequestMaterial;

      const { quantity, budget } = RfqRequestMaterial;

      const statusColor = (() => {
        let color = "#000000";

        if (status === "REPORTED") color = "#EE4124";
        if (status === "RESOLVED") color = "#1C903D";
        if (status === "PENDING") color = "#FFBD00";

        return color;
      })();

      return {
        "S/N": index + 1 < 10 ? `0${index + 1}` : `${index + 1}`,
        "ITEM NAME": name,
        QUANTITY: Intl.NumberFormat().format(quantity),
        "AMOUNT (₦)": Intl.NumberFormat().format(budget),
        "ESTIMATED DELIVERY": deliveryDate,
        STATUS: <StatusPill color={statusColor} status={capitalize(status)} />,
        ACTION: (
          <Button
            _hover={{ background: "#33333" }}
            size="sm"
            fontSize="14px"
            background={"transparent"}
            color="#333333"
            fontWeight="400"
            rightIcon={<FaAngleRight />}
          >
            Contact Customer
          </Button>
        ),
      };
    });
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (!data.data) return;
    setCount(data.data.orders.length);
  }, [setCount, data]);

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={newTable}
        pointerCursor
        empty={
          <EmptyState>
            <Text>Nothing to show</Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default OrderDisputesList;
