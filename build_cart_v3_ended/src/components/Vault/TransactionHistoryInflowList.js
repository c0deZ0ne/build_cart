import { Box, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useGetTransactionHistoryQuery } from "../../redux/api/fundManager/fundManager";
import EmptyState from "../EmptyState";
import BaseTable from "../Table";

/**
 *
 * @param {{tableColumns: string[], tableData: [], startDate: string, endDate: string, searchTerm: string}} param0
 * @returns
 */
const TransactionHistoryInflowList = ({
  tableColumns,
  startDate,
  endDate,
  searchTerm,
}) => {
  const [queryString, setQueryString] = useState("");
  const { data, isLoading, isFetching } = useGetTransactionHistoryQuery(
    queryString,
    {
      skip: !queryString,
    }
  );
  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const mapped = data.data.map((d, index) => {
      const { description, reference, amount, createdAt } = d;
      const SN = index < 9 ? `0${index + 1}` : `${index + 1}`;

      return {
        "S/N": SN,
        DESCRIPTION: description,
        "TRANSACTION ID": `#${reference}`,
        "AMOUNT ₦": Intl.NumberFormat().format(amount),
        DATE: createdAt.split("T")[0],
        TIME: moment(createdAt).format("LT"),
      };
    });

    return mapped;
  }, [data]);

  useEffect(() => {
    let query = `?transaction_type=inflow&search_param=${searchTerm}`;

    if (startDate) {
      query += `&start_date=${startDate}`;
    }
    if (endDate) {
      query += `&end_date=${endDate}`;
    }

    setQueryString(query);
  }, [endDate, startDate, searchTerm]);
  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading || isFetching}
        empty={
          <EmptyState>
            <Text>
              You've not done any{" "}
              <Text as="span" color={"primary"}>
                cash transactions
              </Text>
              .{" "}
              <Text as="span" color={"secondary"}>
                When you do cash transactions
              </Text>{" "}
              they will appear here.
            </Text>
          </EmptyState>
        }
      ></BaseTable>
    </Box>
  );
};

export default TransactionHistoryInflowList;
