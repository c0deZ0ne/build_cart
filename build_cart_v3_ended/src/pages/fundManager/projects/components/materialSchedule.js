import {
  Box,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { IoIosArrowForward } from "react-icons/io";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import CustomCheckBoxIcon from "../../../../components/Checkmark/CustomCheckBox";

const MaterialSchedule = ({ data, setDefaultIndex, userType }) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([
    { name: "Location", isChecked: false },
    { name: "Duration", isChecked: false },
    { name: "Bids", isChecked: false },
    { name: "Date Created", isChecked: false },
    { name: "Status Active", isChecked: false },
    { name: "Pending", isChecked: false },
    { name: "Dispute", isChecked: false },
    { name: "Completed", isChecked: false },
  ]);

  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();

  const getTableData = async () => {
    console.log(data);
    try {
      const arr = [];
      let counter = 1;

      if (data.length < 1) return setLoading(false);
      data.forEach((element) => {
        element?.userUploadMaterial?.forEach((item, i) => {
          arr.push({
            SN: `0${counter}`,
            materialName: item?.name,
            description: item?.description,
            category: item?.category,
            budget: new Intl.NumberFormat().format(item?.budget),
            action:
              userType === "admin" ? (
                ""
              ) : (
                <Flex
                  onClick={() => {
                    setDefaultIndex(1);
                  }}
                  align="center"
                  cursor="pointer"
                  color="#12355A"
                >
                  View RFQ <IoIosArrowForward />
                </Flex>
              ),
            id: item?.id,
          });
          counter++;
        });
      });
      setLoading(false);
      setTableBody(arr);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const tableColumn = [
    "S/N",
    "MATERIAL NAME",
    "DESCRIPTION",
    "CATEGORY",
    "BUDGET (₦)",
    userType === "admin" ? "" : "ACTION",
  ];

  const handleFilterToogle = async (curVal, index) => {
    const filterDataCopy = [...filterData];
    filterDataCopy[index].isChecked = !curVal;
    setFilterData(filterDataCopy);
  };

  const resetAll = () => {
    const filterDataCopy = [...filterData];

    const resetFil = filterDataCopy.map((e, i) => ({
      ...e,
      isChecked: false,
    }));

    setFilterData(resetFil);
  };

  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "center"]}
        gap={2}
      >
        <Box>
          <Flex fontWeight="600" fontSize="24px">
            <Text color="primary" mr="5px">
              Material
            </Text>
            <Text color="secondary"> Schedule</Text>
          </Flex>
          <Text mb="10px" fontSize="14px">
            Upload and manage your Material Schedule here.
          </Text>
        </Box>
        <Flex width={["100%", "100%", "400px"]} gap={4}>
          <Input leftIcon={<RiSearch2Line />} placeholder="Search" />
          <Box>
            <Menu
              isOpen={isOpenMenu}
              onOpen={onOpenMenu}
              onClose={onCloseMenu}
              closeOnSelect={false}
              isLazy
              direction="ltr"
            >
              <MenuButton as="div" style={{ cursor: "pointer" }}>
                <Button leftIcon={<RiFilter2Fill />}>Filter</Button>
              </MenuButton>
              <MenuList>
                <Flex
                  p="10px"
                  fontWeight="600"
                  fontSize="14px"
                  justify="space-between"
                >
                  <Text color="info">Filter by:</Text>
                  <Text cursor="pointer" onClick={resetAll} color="primary">
                    Clear all
                  </Text>
                </Flex>
                <MenuDivider />
                {filterData.map((e, i) => (
                  <MenuItem
                    display="flex"
                    justifyContent="space-between"
                    key={i}
                    as="label"
                    htmlFor={`${e?.name}${i}`}
                    cursor="pointer"
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {e?.name}
                    </span>
                    <Checkbox
                      id={`${e?.name}${i}`}
                      outline="1px solid #12355a"
                      colorScheme=""
                      icon={<CustomCheckBoxIcon />}
                      isChecked={e?.isChecked}
                      onChange={() => handleFilterToogle(e?.isChecked, i)}
                    />
                  </MenuItem>
                ))}
                <MenuDivider />

                <Box p="10px">
                  <Button full onClick={onCloseMenu}>
                    Apply
                  </Button>
                </Box>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              <Text>
                No{" "}
                <Text as="span" color="secondary">
                  Material Schedule
                </Text>{" "}
                has been added to this project
              </Text>
            </EmptyState>
          }
        />
      </Box>
    </Box>
  );
};

export default MaterialSchedule;
