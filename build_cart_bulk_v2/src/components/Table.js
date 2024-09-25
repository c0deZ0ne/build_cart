import {
  Box,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

export default function BaseTable({
  tableColumn,
  tableBody,
  empty,
  isLoading,
  onClick = () => {},
  pointerCursor = false,
  skipRender = ["id"],
}) {
  function handleRowClick(record) {
    onClick(record);
  }

  return (
    <TableContainer>
      <Table>
        {tableBody?.length > 0 && (
          <Thead bg="#12355A">
            <Tr p="25px 22px">
              {tableColumn.map((header, index) => {
                return (
                  <Th
                    _first={{
                      borderTopLeftRadius: "8px",
                      p: "25px 0 25px 22px",
                    }}
                    _last={{
                      borderTopRightRadius: "8px",
                      p: "25px 22px 25px 0px",
                    }}
                    color="#fff"
                    key={index}
                  >
                    <Flex align="center" gap="8px">
                      {typeof header === "object" && header !== null
                        ? header.name
                        : header}
                      {typeof header === "object" && header !== null
                        ? header.icon
                        : ""}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
        )}
        <Tbody>
          {tableBody.map((body, index) => {
            return (
              <StyledTR
                key={index}
                _odd={{ bg: "rgba(153, 153, 153, 0.08)" }}
                onClick={() => handleRowClick(body)}
                cursor={pointerCursor ? "pointer" : "auto"}
                className={body.customClass ?? ""}
              >
                {Object.keys(body).map((key, ind) => {
                  if (!skipRender.includes(key)) {
                    return (
                      <Td key={key + ind} color="#333">
                        {body[key]}
                      </Td>
                    );
                  } else {
                    return null;
                  }
                })}
              </StyledTR>
            );
          })}
          {tableBody?.length === 0 && !isLoading && (
            <Tr>
              <Td colSpan={tableColumn?.length}>{empty}</Td>
            </Tr>
          )}
          {isLoading && (
            <Tr>
              <Td colSpan={tableColumn?.length}>
                <Box w="fit-content" mx="auto">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#12355A"
                    size="xl"
                  />
                </Box>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

const StyledTR = styled(Tr)`
  &:hover {
    &:nth-child(odd) {
      background: rgba(153, 153, 153, 0.3);
    }
    &:nth-child(even) {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  &.collapsed {
    display: none;
  }

  &.is-sub {
    visibility: collapse;

    &.show {
      visibility: visible;
    }
  }
`;
