import {
  Box,
  Button as ChakraButton,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { FaNairaSign, FaPen } from "react-icons/fa6";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as yup from "yup";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import EmptyState from "../../../components/EmptyState";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Input from "../../../components/Input";
import DialogModal from "../../../components/Modals/Dialog";
import BaseModal from "../../../components/Modals/Modal";
import SuccessMessage from "../../../components/SuccessMessage";
import BaseTable from "../../../components/Table";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetAllMetricsQuery } from "../../../redux/api/api";
import {
  useFetchProductsByCategoryQuery,
  usePauseAProductMutation,
  useUpdateAProductMutation,
} from "../../../redux/api/super-admin/superAdminSlice";
import { addTransparency } from "../../../utility/helpers";
import CreateCategory from "./components/createCategory";

const tableColumns = [
  "S/N",
  "ITEM NAME",
  "SPECIFICATION",
  "MEASUREMENT",
  "SUPPLIER COUNT",
  "TOTAL ORDERS",
  "TOTAL REVENUE (₦)",
  "ACTIVE ORDERS",
  "ACTION",
];

const EditModal = ({ isOpen, onClose, product, refetch }) => {
  const toast = useToast();
  const { data: measurementData, isLoading: measurementDataLoading } =
    useGetAllMetricsQuery({ pageSize: 100 });

  const [updateFn, { isLoading: isUpdating, isSuccess, isError, error }] =
    useUpdateAProductMutation();

  const metricsData = useMemo(() => {
    if (!measurementData) return [];
    if (!measurementData.data) return [];

    const mapped = measurementData.data.map((m) => {
      return {
        value: m.id,
        label: m.name,
      };
    });

    return mapped;
  }, [measurementData]);

  const formSchema = yup.object({
    quantity: yup
      .number()
      .min(1)
      .required("quantity is required")
      .typeError("Quantity should be a number"),
    metric: yup
      .object()
      .shape({
        label: yup.string(),
        value: yup.string(),
      })
      .required("metric is required")
      .typeError("metric is required"),
    price: yup.object().shape({
      min: yup
        .number()
        .required("min price is required")
        .typeError("min price must be a number"),
      max: yup
        .number()
        .required("max price is required")
        .typeError("max price must be a number")
        .test(
          "must-be-more",
          "max price should be greater or equal to min price",
          function () {
            const { min, max } = this.parent;

            return max >= min;
          }
        ),
    }),
  });

  const methods = useForm({
    defaultValues: {
      quantity: "",
      metric: null,
      price: {
        min: "",
        max: "",
      },
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    resetField,
    setValue,
  } = methods;

  async function onSubmit(data) {
    console.log(data);
    updateFn({
      productId: product.id,
      data: {
        name: product.name,
        measurement: { id: data.metric.value, name: data.metric.label },
        quantity: data.quantity + "",
        price: `${data.price.min} = ${data.price.max}`,
      },
    });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        status: "success",
        description: "Updated!",
      });
      refetch();
    }

    if (isError && error) {
      toast({
        status: "error",
        description: error.data.message,
      });
    }
  }, [error, isError, isSuccess, toast]);

  return (
    <BaseModal
      isOpen={isOpen}
      title={"Edit Product specifications"}
      onClose={onClose}
      showHeader={!isSuccess}
    >
      {isSuccess ? (
        <SuccessMessage message={"Update successful!"}></SuccessMessage>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={"1fr 1fr"} columnGap={"28px"} rowGap={"24px"}>
            <GridItem gridColumn={"1/-1"}>
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Item Name
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Input value={product.name} isDisabled />
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Quantity
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="quantity"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Input
                        type={"text"}
                        value={value}
                        onChange={onChange}
                        placeholder="Quantity"
                      />
                      <div style={{ color: "red" }}>
                        {errors.quantity ? errors.quantity.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Metric{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>

                <Controller
                  name="metric"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <CustomSelect
                        options={metricsData}
                        value={value}
                        onChange={onChange}
                        isDisabled={measurementDataLoading}
                        isLoading={measurementDataLoading}
                        placeholder="Metric"
                      />

                      <div style={{ color: "red" }}>
                        {errors.metric ? errors.metric.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>
            </GridItem>

            <GridItem gridColumn={"1/-1"}>
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Price Range{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>

                <Grid
                  templateColumns={"2fr 0.5fr 2fr"}
                  gap={"24px"}
                  alignItems={"center"}
                >
                  <Controller
                    name="price.min"
                    defaultValue=""
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Box>
                        <Input
                          type={"Text"}
                          value={value}
                          onChange={onChange}
                          placeholder="Start from"
                          leftIcon={<FaNairaSign />}
                        />
                      </Box>
                    )}
                  />

                  <Divider borderColor={"#333333"} />

                  <Controller
                    name="price.max"
                    defaultValue=""
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Box>
                        <Input
                          type={"text"}
                          value={value}
                          onChange={onChange}
                          placeholder="Highest"
                          leftIcon={<FaNairaSign />}
                        />
                      </Box>
                    )}
                  />
                </Grid>
                <div style={{ color: "red", textAlign: "center" }}>
                  {errors.price?.min
                    ? errors.price?.min?.message
                    : errors.price?.max
                    ? errors.price?.max?.message
                    : ""}
                </div>
              </Box>
            </GridItem>
          </Grid>

          <Box mt={"40px"}>
            <Button full isSubmit isLoading={isUpdating}>
              Update
            </Button>
          </Box>
        </form>
      )}
    </BaseModal>
  );
};

/**
 *
 * @param {{pauseStatus: boolean, product: Object, refetch: Function}} props
 */
function Actions({ pauseStatus, product, refetch }) {
  const toast = useToast();

  const {
    isOpen: isOpenPauseDialog,
    onClose: onClosePauseDialog,
    onOpen: onOpenPauseDialog,
  } = useDisclosure();

  const {
    isOpen: editModalIsOpen,
    onClose: onCloseEditModal,
    onOpen: onOpenEditModal,
  } = useDisclosure();

  const [
    pauseFn,
    {
      isLoading: isPausing,
      isSuccess: pauseSuccess,
      isError: pauseFailed,
      error: pauseError,
    },
  ] = usePauseAProductMutation();

  useEffect(() => {
    if (pauseSuccess) {
      toast({
        status: "success",
        description: `${
          pauseStatus ? "Unpaused" : "Paused"
        } product successful`,
      });

      refetch();

      onClosePauseDialog();
    }

    if (pauseFailed && pauseError) {
      toast({
        status: "error",
        description: pauseError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseError, pauseFailed, pauseSuccess]);

  return (
    <Flex ml={"-24px"} gap={"24px"}>
      <ChakraButton
        onClick={(e) => {
          e.stopPropagation();
          // setOpenPauseDialog(true);
          onOpenPauseDialog();
        }}
        background={addTransparency(!pauseStatus ? "#FFBD00" : "#1C903D", 0.16)}
        color={!pauseStatus ? "#FFBD00" : "#1C903D"}
        height={"32px"}
        fontSize="14px"
        padding={"6px 20px"}
      >
        {!pauseStatus ? "Unpause" : "Pause"}
      </ChakraButton>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenEditModal();
        }}
      >
        <FaPen size={"16px"} />
      </button>

      {isOpenPauseDialog && (
        <DialogModal
          isLoading={isPausing}
          onClose={onClosePauseDialog}
          isOpen={true}
          title="Pause Product"
          message="Are you sure you want to pause this product?"
          onNo={onClosePauseDialog}
          onYes={() => {
            pauseFn({ productId: product.id, visibility: !pauseStatus });
          }}
        ></DialogModal>
      )}

      {editModalIsOpen && (
        <EditModal
          isOpen={editModalIsOpen}
          onClose={onCloseEditModal}
          product={product}
          key={editModalIsOpen}
          refetch={refetch}
        />
      )}
    </Flex>
  );
}

const SingleProductCategory = () => {
  const { productCategoryId } = useParams();

  const { data, isLoading, refetch } =
    useFetchProductsByCategoryQuery(productCategoryId);

  const neededData = useMemo(() => {
    if (!data) return;
    if (!data.data) return;

    const {
      products,
      name,
      activeOrders,
      vendorProductCount,
      totalOrders,
      totalRevenue,
      productCount,
    } = data.data;

    return {
      category: { name, id: productCategoryId },
      activeOrders,
      vendorProductCount,
      totalOrders,
      totalRevenue,
      products,
      productCount,
    };
  }, [data, productCategoryId]);

  const tableData = useMemo(() => {
    if (!neededData) return [];

    const mapped = neededData.products.map((product, index) => {
      const {
        name,
        specification,
        measurement,
        vendorProductCount,
        totalOrders,
        totalRevenue,
        activeOrders,
        pauseStatus,
      } = product;

      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "ITEM NAME": name,
        SPECIFICATION: specification,
        MEASUREMENT: measurement,
        "SUPPLIER COUNT": vendorProductCount,
        "TOTAL ORDERS": Intl.NumberFormat().format(totalOrders),
        "TOTAL REVENUE (₦)": Intl.NumberFormat().format(totalRevenue),
        "ACTIVE ORDERS": Intl.NumberFormat().format(activeOrders),
        ACTION: (
          <Actions
            pauseStatus={pauseStatus}
            product={product}
            refetch={refetch}
          />
        ),
      };
    });
    return mapped;
  }, [neededData]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <DashboardWrapper>
      <Box>
        <GoBackButton />
        {neededData && (
          <Box>
            <Text
              fontSize={"32px"}
              fontWeight={500}
              color={"#12355A"}
              my={"28px"}
            >
              {neededData.category.name}
            </Text>
            <Flex
              align={"flex-start"}
              justifyContent={"space-between"}
              // wrap={"wrap-reverse"}
              gap={"24px"}
            >
              <Cards
                cardDetail={{
                  name: "Total Product",
                  info: "info",
                  description: "description",
                  quantity: neededData.productCount,
                  icon: <FaCheckCircle size={"24px"} />,
                }}
                width="280px"
                h="128px"
              />

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
                Add new product
              </Button>
            </Flex>

            <Grid
              mt={"24px"}
              gridTemplateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              columnGap={"32px"}
              rowGap={"24px"}
            >
              <GridItem>
                <Cards
                  cardDetail={{
                    name: "Total Orders",
                    info: "info",
                    description: "description",
                    quantity: neededData.totalOrders,
                    icon: <FaCheckCircle size={"24px"} />,
                  }}
                  h="128px"
                  bg="#12355A"
                />
              </GridItem>
              <GridItem>
                <Cards
                  cardDetail={{
                    name: "Total Vendors",
                    info: "info",
                    description: "description",
                    quantity: neededData.vendorProductCount,
                    icon: <FaCheckCircle size={"24px"} />,
                  }}
                  h="128px"
                  bg="#C43C25"
                />
              </GridItem>{" "}
              <GridItem>
                <Cards
                  cardDetail={{
                    name: "Total Revenue",
                    info: "info",
                    description: "description",
                    quantity: neededData.totalRevenue,
                    icon: <FaCheckCircle size={"24px"} />,
                  }}
                  h="128px"
                  bg="#FFBD00"
                />
              </GridItem>{" "}
              <GridItem>
                <Cards
                  cardDetail={{
                    name: "Total Active Orders",
                    info: "info",
                    description: "description",
                    quantity: neededData.activeOrders,
                    icon: <FaCheckCircle size={"24px"} />,
                  }}
                  h="128px"
                  bg="#F5852C"
                />
              </GridItem>
            </Grid>
            <Box mt={"28px"}>
              <Box>
                <Text color={"secondary"} fontSize={"20px"} fontWeight={600}>
                  Product Manager
                </Text>

                <Text color={"primary"} fontSize={"12px"}>
                  All items under each category on the platform is managed here.
                </Text>
              </Box>

              <Box mt={"24px"}>
                <BaseTable
                  isLoading={isLoading}
                  tableColumn={tableColumns}
                  tableBody={tableData}
                  empty={
                    <EmptyState>
                      <Text>No product under this category</Text>
                    </EmptyState>
                  }
                ></BaseTable>
              </Box>
            </Box>

            <CreateCategory
              isEditting
              isOpen={isOpen}
              onClose={onClose}
              refetch={refetch}
              categoryToEdit={{
                label: neededData.category.name,
                value: neededData.category.id,
              }}
            />
          </Box>
        )}
      </Box>
    </DashboardWrapper>
  );
};

export default SingleProductCategory;
