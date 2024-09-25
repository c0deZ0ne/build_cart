import { Box, Text } from "@chakra-ui/react";
import React from "react";
import EmptyState from "../../components/EmptyState";
import BaseTable from "../Table";

/**
 *
 * @param {object} props
 * @param {Array} props.tableColumns
 * @param {Array} props.tableColumns
 * @param {boolean} props.isLoading
 * @returns
 */
const ProductCategoryList = ({ tableColumns, tableData, isLoading }) => {
  function handleRowClick(data) {
    if (data.isExpandable) {
      const items = document.getElementsByClassName(data.customClass);

      const subs = Array.from(items).filter((item) =>
        item.classList.contains("is-sub")
      );
      // const [parent, ...rest] = items;

      subs.forEach((sub) => {
        sub.classList.toggle("show");
      });
    }
  }

  return (
    <Box>
      <BaseTable
        pointerCursor
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading}
        skipRender={["customClass", "isExpandable"]}
        onClick={handleRowClick}
        empty={
          <EmptyState>
            <Text>
              You haven't added any products yet.{" "}
              <Text as="span" color={"secondary"}>
                Products you add will be shown here.
              </Text>{" "}
            </Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default ProductCategoryList;
