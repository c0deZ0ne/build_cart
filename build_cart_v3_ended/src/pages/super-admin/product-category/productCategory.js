import {
  Box,
  Button as ChakraButton,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { RiSearch2Line } from "react-icons/ri";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import EmptyState from "../../../components/EmptyState";
import TeamIcon from "../../../components/Icons/Team";
import Input from "../../../components/Input";
import DialogModal from "../../../components/Modals/Dialog";
import BaseTable from "../../../components/Table";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  useGetAllProductCategoriesQuery,
  usePauseACategoryMutation,
} from "../../../redux/api/super-admin/superAdminSlice";
import { addTransparency } from "../../../utility/helpers";
import CreateCategory from "./components/createCategory";
const tableColumn = [
  "S/N",
  "PRODUCT CATEGORY",
  "PRODUCT COUNT",
  "SUPPLIER COUNT",
  "TOTAL ORDERS",
  "TOTAL REVENUE (₦)",
  "ACTIVE ORDERS",
  "ACTION",
];

/**
 *
 * @typedef {{id: string, label: string}} CategoryItem
 * @param {{pausedStatus: null | boolean, refetch: Function, category: CategoryItem}} props
 * @returns
 */
function Actions({ pausedStatus, refetch, category }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [
    pauseFn,
    {
      isLoading: isPausing,
      isSuccess: pauseSuccess,
      isError: pauseFailed,
      error: pauseError,
    },
  ] = usePauseACategoryMutation();

  useEffect(() => {
    if (pauseSuccess) {
      toast({
        status: "success",
        description: "",
      });
      refetch();
      setOpenPauseDialog(false);
    }

    if (pauseFailed && pauseError) {
      toast({
        status: "error",
        description: pauseError.data.message,
      });
    }
  }, [pauseSuccess, pauseFailed, pauseError]);

  return (
    <Flex ml={"-24px"} gap={"24px"}>
      <ChakraButton
        onClick={(e) => {
          e.stopPropagation();
          setOpenPauseDialog(true);
        }}
        background={addTransparency(
          !pausedStatus ? "#FFBD00" : "#1C903D",
          0.16
        )}
        color={!pausedStatus ? "#FFBD00" : "#1C903D"}
        height={"32px"}
        fontSize="14px"
        padding={"6px 20px"}
      >
        {!pausedStatus ? "Unpause" : "Pause"}
      </ChakraButton>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        <FaPen size={"16px"} />
      </button>

      {openPauseDialog && (
        <DialogModal
          isLoading={isPausing}
          isOpen={true}
          onClose={() => setOpenPauseDialog(false)}
          title="Pause Product"
          message="Are you sure you want to pause this product?"
          onNo={() => setOpenPauseDialog(false)}
          onYes={() =>
            pauseFn({ categoryId: category.id, visibility: !pausedStatus })
          }
        />
      )}

      <CreateCategory
        refetch={refetch}
        isOpen={isOpen}
        onClose={onClose}
        key={isOpen}
        isEditting
        categoryToEdit={{ label: category.label, value: category.id }}
      />
    </Flex>
  );
}

export default function SuperAdminProductCategory() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const history = useHistory();

  const {
    data: productCategoriesData,
    refetch,
    isLoading,
  } = useGetAllProductCategoriesQuery();

  const tableData = useMemo(() => {
    if (!productCategoriesData) return [];
    if (!productCategoriesData.data) return [];

    const mapped = productCategoriesData.data.map((cat, index) => {
      const {
        id,
        name,
        productCount,
        vendorProductCount,

        totalOrders,
        totalRevenue,
        activeOrders,
        pausedStatus,
      } = cat;

      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "PRODUCT CATEGORY": name,
        "PRODUCT COUNT": productCount,
        "SUPPLIER COUNT": vendorProductCount,
        "TOTAL ORDERS": totalOrders,
        "TOTAL REVENUE (₦)": Intl.NumberFormat().format(totalRevenue),
        "ACTIVE ORDERS": activeOrders,
        categoryId: id,
        ACTION: (
          <Actions
            pausedStatus={pausedStatus}
            refetch={refetch}
            category={{ id: id, label: name }}
          />
        ),
      };
    });

    return mapped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategoriesData]);

  const [titleCard, setTitleCard] = useState({
    name: "Total Number of Categories",
    icon: <TeamIcon fill="#12355A" opacity="1" />,
    quantity: 0,
  });

  useEffect(() => {
    if (!productCategoriesData) return;
    setTitleCard((t) => ({ ...t, quantity: productCategoriesData.total }));
  }, [productCategoriesData]);

  function handleRowClick(rowData) {
    console.log(rowData);

    history.push(`/super-admin/product-category/${rowData.categoryId}`);
  }

  return (
    <DashboardWrapper pageTitle="Product Category">
      <Flex justify="space-between" mb="24px">
        <Cards cardDetail={titleCard} width="342px" h="128px" />
        <Box>
          <Button
            type="button"
            fontWeight="600"
            width={{ base: "180px", md: "242px" }}
            background="#F5852C"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            Add new product category
          </Button>
        </Box>
      </Flex>

      <Box bgColor="rgba(245, 133, 44, 0.04)" pt="16px" px="12px">
        <Flex
          justifyContent="space-between"
          align="center"
          mb="24px"
          wrap={"wrap"}
          gap={"24px"}
        >
          <Box>
            <Box as="h3" color="secondary" fontSize="20px" fontWeight="600">
              Product Category Manager
            </Box>
            <Text color="primary" fontSize="14px">
              Manage all product categories here.
            </Text>
          </Box>
          <Box w={{ base: "100%", md: "462px" }} ml="auto">
            <Input
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
        </Flex>
        <Box bg="#fff" borderRadius="8px" my="30px">
          <BaseTable
            skipRender={["categoryId"]}
            tableColumn={tableColumn}
            tableBody={tableData}
            isLoading={isLoading}
            onClick={handleRowClick}
            empty={
              <EmptyState>
                <Text>
                  There are no{" "}
                  <Text as="span" color="#F5852C">
                    Product categories
                  </Text>{" "}
                  on the platform.
                </Text>
              </EmptyState>
            }
          />
        </Box>
      </Box>
      <CreateCategory
        isOpen={isOpen}
        onClose={onClose}
        key={isOpen}
        refetch={refetch}
      />
    </DashboardWrapper>
  );
}
