import {
  Box,
  Button as ChakraButton,
  Checkbox,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaPlay } from "react-icons/fa";
import { RiEdit2Fill, RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import Button from "../../../components/Button";
import CustomCheckBoxIcon from "../../../components/Checkmark/CustomCheckBox";
import Clipboard from "../../../components/Icons/Clipboard";
import DeleteIcon from "../../../components/Icons/Delete";
import Pause from "../../../components/Icons/Pause";
import Input from "../../../components/Input";
import AddAndEditCategoryModal from "../../../components/Vendors/AddAndEditCategoryModal";
import ProductCategoryList from "../../../components/Vendors/ProductCategoryList";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  useGetVendorProductsQuery,
  useRemoveProductFromVendorMutation,
  useRemoveSpecFromProductMutation,
  useUpdateProductVisibilityMutation,
} from "../../../redux/api/vendor/vendor";
import { addTransparency } from "../../../utility/helpers";

import DialogModal from "../../../components/Modals/Dialog";

const tableColumns = [
  "S/N",
  "PRODUCT NAME",
  "PRODUCT CATEGORY",
  "SPECIFICATIONS",
  "MEASUREMENT",
  "ACTION",
];

/**
 *
 * @param {{SN, categoryName: string, categoryId: string, productName: string, productImage: string, specName:  string, specId: string, measurement: string, isChild: boolean, productId: string, numberOfChildren: number, showDropdown: boolean, PID: string, refetch: Function, isVisible: boolean}} arg
 */
function processObject({
  SN,
  categoryName,
  productName,
  productImage,
  specName,
  specId,
  measurement,
  isChild,
  productId,
  numberOfChildren,
  showDropdown,
  categoryId,
  refetch,
  PID,
  isVisible,
}) {
  const hasSubs = !isChild && numberOfChildren > 0;
  return {
    SN: isChild ? (
      "-"
    ) : (
      <Box>
        {SN}
        {showDropdown && (
          <Button size="sm" background="transparent" color="#12355a">
            <FaAngleDown />
          </Button>
        )}
      </Box>
    ),
    "PRODUCT NAME": (
      <Flex gap={"8px"} alignItems={"center"}>
        {" "}
        <Image
          src={productImage}
          borderRadius={"50%"}
          height={"40px"}
          width={"40px"}
        />{" "}
        {productName}
        {numberOfChildren > 0 && (
          <Flex
            flexShrink={"0"}
            align={"center"}
            justify={"center"}
            height={"24px"}
            width={"24px"}
            borderRadius={"50%"}
            color={"secondary"}
            fontSize={"12px"}
            fontWeight={600}
            backgroundColor={addTransparency("#F5852C", 0.16)}
          >
            {numberOfChildren}
          </Flex>
        )}
      </Flex>
    ),
    "PRODUCT CATEGORY": categoryName,
    SPECIFICATIONS: specName,
    MEASUREMENT: measurement,
    ACTION: isChild ? (
      <ChildActions
        productId={productId}
        productName={productName}
        refetchTableData={refetch}
        specification={{ id: specId, name: specName }}
      />
    ) : (
      <ParentActions
        categoryId={categoryId}
        productId={productId}
        productName={productName}
        refetchTableData={refetch}
        PID={PID}
        isVisible={isVisible}
      />
    ),
    customClass: `${productId} ${isChild ? "is-sub" : ""}`,
    isExpandable: hasSubs,
  };
}

/**
 *
 * @param {{specifications: Array, SN: number, categoryName: string, categoryId: string, productName: string, productImage: string, measurement: measurement, productId: string, PID: string, isVisible: boolean, refetch: Function}} arg
 */

function processArray({
  specifications,
  SN,
  categoryName,
  productName,
  productImage,
  measurement,
  productId,
  refetch,
  categoryId,
  PID,
  isVisible,
}) {
  const result = [];

  if (specifications.length === 1) {
    const {
      value: specName,
      VendorProductSpecificationProduct: { id: specId },
    } = specifications[0];

    const obj = processObject({
      SN,
      categoryName,
      productName,
      productImage,
      isChild: false,
      specName: specName,
      specId: specId,
      measurement,
      numberOfChildren: 0,
      productId,
      showDropdown: false,
      refetch,
      categoryId,
      PID,
      isVisible,
    });

    result.push(obj);

    return result;
  }

  /**
   * FOR MULTIPLE
   */
  specifications.forEach((spec) => {
    const {
      value: specName,
      VendorProductSpecificationProduct: { id: specId },
    } = spec;
    const obj = processObject({
      SN,
      categoryName,
      productName,
      measurement,
      isChild: true,
      productImage,
      specName: specName,
      specId: specId,
      numberOfChildren: 0,
      productId,
      showDropdown: false,
      refetch,
      categoryId,
      PID,
      isVisible,
    });

    result.push(obj);
  });

  /**
   * FOR THE PARENT
   */

  const parent = processObject({
    SN,
    productName,
    productImage,
    numberOfChildren: specifications.length,
    categoryName,
    isChild: false,
    measurement,
    productId,
    specName: specifications.map((spec) => spec.value).join(", "),
    specId: "-",
    showDropdown: true,
    refetch,
    categoryId,
    PID,
    isVisible,
  });

  result.unshift(parent);

  return result;
}

/**
 *
 * @param {{productName: string, productId: string, categoryId: string, PID: string, refetchTableData: () => void, isVisible: boolean}} props
 * @returns
 */
const ParentActions = ({
  productName,
  productId,
  refetchTableData,
  categoryId,
  PID,
  isVisible,
}) => {
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);

  const [
    removeFn,
    {
      isLoading: deleting,
      isError: deletingFailed,
      isSuccess: deleteSuccess,
      error: deleteError,
    },
  ] = useRemoveProductFromVendorMutation();

  const [
    updateFn,
    {
      isLoading: updating,
      isError: updateFailed,
      isSuccess: updateSuccess,
      error: updateError,
    },
  ] = useUpdateProductVisibilityMutation();

  useEffect(() => {
    if (deleteSuccess) {
      refetchTableData();
      toast({
        position: "top-right",
        status: "success",
        description: `${productName} removed from catalog!`,
      });
      setShowDeleteDialog(false);
    }

    if (deletingFailed && deleteError) {
      // handleError(error);

      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: deleteError.data.message,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteError, deleteSuccess, deletingFailed]);

  useEffect(() => {
    if (updateSuccess) {
      refetchTableData();
      toast({
        position: "top-right",
        status: "success",
        description: `${productName}'s visibility updated!`,
      });
      setShowVisibilityModal(false);
    }

    if (updateFailed && updateError) {
      // handleError(error);

      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: updateError.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateError, updateFailed, updateSuccess]);

  function removeIt() {
    removeFn([productId]);
  }

  return (
    <Box>
      <Flex ml={"-24px"} gap={"1rem"} align={"center"}>
        <ChakraButton
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation();
            setShowEditModal(true);
          }}
        >
          <RiEdit2Fill fill="#12355a" />
        </ChakraButton>
        <ChakraButton
          variant={"ghost"}
          p={0}
          onClick={(e) => {
            e.stopPropagation();
            setShowVisibilityModal(true);
          }}
        >
          {isVisible ? (
            <Pause fill="#FFBD00" color="#FFBD00" />
          ) : (
            <FaPlay fill="#FFBD00" color="#FFBD00" />
          )}
        </ChakraButton>
        <ChakraButton
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
        >
          <DeleteIcon fill="#C43C25" color="#C43C25" />
        </ChakraButton>
      </Flex>

      {showDeleteDialog && (
        <DialogModal
          isOpen={showDeleteDialog}
          message={
            <Text>
              Are you sure you want to remove{" "}
              <Text as={"span"} fontWeight={600}>
                {productName}
              </Text>{" "}
              from your catalog?
            </Text>
          }
          yesText="Yes, Delete"
          noText="No, Cancel"
          onClose={() => setShowDeleteDialog(false)}
          onNo={(e) => {
            setShowDeleteDialog(false);
          }}
          onYes={removeIt}
          title="Delete Product?"
          isLoading={deleting}
        />
      )}

      {showEditModal && (
        <AddAndEditCategoryModal
          onSuccess={refetchTableData}
          action="edit"
          defaultCategoryID={categoryId}
          isOpen={showEditModal}
          closeModal={() => setShowEditModal(false)}
        />
      )}

      {showVisibilityModal && (
        <DialogModal
          isOpen
          title="Confirm Action"
          message={
            <Text>
              {isVisible ? "Pause" : "Unpause"}{" "}
              <Text as={"span"} fontWeight={600}>
                {productName}
              </Text>
              {" ?"}
            </Text>
          }
          yesText="Yes"
          noText="No"
          onClose={() => setShowVisibilityModal(false)}
          onNo={() => setShowVisibilityModal(false)}
          onYes={() => updateFn(PID)}
          isLoading={updating}
        />
      )}
    </Box>
  );
};

/**
 *
 * @param {{productName: string, productId: string, refetchTableData: () => void, specification: {name: string, id: string}}} props
 * @returns
 */
const ChildActions = ({
  productName,
  productId,
  refetchTableData,
  specification,
}) => {
  const toast = useToast();
  const [removeFn, { isLoading, isError, isSuccess, error }] =
    useRemoveSpecFromProductMutation();

  const [showRemoveSpecDialog, setShowRemoveSpecDialog] = useState("");

  useEffect(() => {
    if (isSuccess) {
      toast({
        position: "top-right",
        status: "success",
        description: `${specification.name} removed from ${productName}.`,
      });
      refetchTableData();
      setShowRemoveSpecDialog(false);
    }

    if (isError && error) {
      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: error.data.message,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess, isError]);

  return (
    <Box>
      <Flex ml={"-24px"} gap={"1rem"} align={"center"}>
        <ChakraButton
          variant={"ghost"}
          onClick={() => setShowRemoveSpecDialog(true)}
        >
          <DeleteIcon fill="#12355a" color="#12355a" />
        </ChakraButton>
      </Flex>

      {showRemoveSpecDialog && (
        <DialogModal
          isOpen={true}
          isLoading={isLoading}
          title={`Remove Specification`}
          message={
            <Text>
              Remove{" "}
              <Text as={"span"} fontWeight={600}>
                {specification.name}
              </Text>{" "}
              from {productName}?
            </Text>
          }
          noText="No, Cancel"
          yesText="Yes, Proceed"
          onClose={() => setShowRemoveSpecDialog(false)}
          onYes={() => removeFn(specification.id)}
          onNo={() => setShowRemoveSpecDialog(false)}
        ></DialogModal>
      )}
    </Box>
  );
};

/**
 *
 * @param {{setFilters: Function(filters: Filters)}} param0
 * @returns
 */
const Filters = ({ setFilters }) => {
  const [measurementFilter, setMeasurementFilter] = useState({
    tonnes: false,
    bags: false,
  });
  const [categoryFilter, setCategoryFilter] = useState({
    cement: false,
    aggregate: false,
  });

  const filters = useMemo(() => {
    return { ...measurementFilter, ...categoryFilter };
  }, [categoryFilter, measurementFilter]);

  function resetFilters() {
    setMeasurementFilter({ distributor: false, manufacturer: false });
    setCategoryFilter({ aggregate: false, cement: false });
  }

  return (
    <Popover placement="auto">
      <PopoverTrigger>
        <Box
          as={"button"}
          height={"48px"}
          backgroundColor={"primary"}
          color={"white"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"16px"}
          p={"12px"}
          borderRadius={"8px"}
          fontWeight={700}
          fontSize={"14px"}
        >
          <RiFilter2Fill />
          Filter{" "}
        </Box>
      </PopoverTrigger>
      <PopoverContent px="16px" pt="16px" pb={"28px"}>
        <PopoverBody>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Text fontSize={"12px"} color={"#999"}>
              Filter by
            </Text>
            <ChakraButton
              onClick={resetFilters}
              variant="ghost"
              color="primary"
              size="xs"
              border={0}
              p="0"
            >
              Clear All
            </ChakraButton>
          </Flex>

          <VStack gap="24px" width={"100%"} mt={"24px"}>
            <Box width={"100%"}>
              <Text fontSize={"12px"} fontWeight={600}>
                Product Category{" "}
              </Text>

              <VStack spacing="16px" mt="8px">
                {Object.entries(categoryFilter).map(([key, value]) => {
                  return (
                    <Flex
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text color={"#333"} textTransform={"capitalize"}>
                        {key}
                      </Text>
                      <Checkbox
                        isChecked={value}
                        onChange={(e) =>
                          setCategoryFilter({
                            ...categoryFilter,
                            [key]: !value,
                          })
                        }
                        colorScheme="primary"
                        size="lg"
                        icon={<CustomCheckBoxIcon />}
                      ></Checkbox>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            <Box width={"100%"}>
              <Text fontSize={"12px"} fontWeight={600}>
                Measurement
              </Text>

              <VStack spacing="16px" mt="8px">
                {/* <Box width={"100%"}> */}

                {Object.entries(measurementFilter).map(([key, value]) => {
                  return (
                    <Flex
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text color={"#333"} textTransform={"capitalize"}>
                        {key}
                      </Text>
                      <Checkbox
                        onChange={(e) =>
                          setMeasurementFilter({
                            ...measurementFilter,
                            [key]: !value,
                          })
                        }
                        isChecked={value}
                        colorScheme="primary"
                        size="lg"
                        icon={<CustomCheckBoxIcon />}
                      ></Checkbox>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          </VStack>

          <Box mt={"40px"}>
            <Button fontWeight="600" full onClick={() => setFilters(filters)}>
              Apply
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

/**
 * @param {object} props
 * @param {() => void} props.onClick
 * @param {Function} props.refetch
 * @param {number | string} props.itemsCount
 * @returns
 */
const TopPart = ({ onClick, refetch, itemsCount }) => {
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [renderKey, setRenderKey] = useState(true);

  return (
    <Flex justify={"space-between"} wrap="wrap" gap={"24px"}>
      <Box
        width={"342px"}
        pr={"16px"}
        pl={"24px"}
        pt={"24px"}
        pb={"10px"}
        borderRadius={"8px"}
        boxShadow="base"
        border={`1px solid ${addTransparency("#12355A", 0.05)}`}
        borderLeft="4px solid #12355A"
      >
        <Flex color={"primary"} align={"center"} gap={"8px"}>
          <Flex
            borderRadius={"50%"}
            align={"center"}
            justify={"center"}
            height={"40px"}
            width={"40px"}
            backgroundColor={addTransparency("#12355A", 0.08)}
          >
            <Clipboard />
          </Flex>

          <Text fontSize={"14px"} fontWeight={500}>
            Product Category Count
          </Text>
        </Flex>

        <Flex justify={"space-between"} align={"center"} mt={"28px"}>
          <Text fontSize={"24px"} fontWeight={700} color={"primary"}>
            {itemsCount}
          </Text>
        </Flex>
      </Box>

      <Button onClick={() => setOpenAddCategoryModal(true)}>
        Add Product Category
      </Button>

      <AddAndEditCategoryModal
        onSuccess={refetch}
        isOpen={openAddCategoryModal}
        closeModal={() => {
          setOpenAddCategoryModal(false);
          setRenderKey(!renderKey);
        }}
        action="add"
        key={renderKey}
      />
    </Flex>
  );
};

const ProductCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(!true);
  const [renderKey, setRenderKey] = useState(true);
  const [filters, setFilters] = useState();

  const {
    data: allProducts,
    isLoading,
    refetch,
  } = useGetVendorProductsQuery(search);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const newTable = useMemo(() => {
    if (!allProducts) return [];
    if (!allProducts.data) return [];

    const mapped = allProducts.data.products.map((p, index) => {
      const SN = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

      const { product, specifications, id: PID, product_visibility } = p;

      const { name, image_url, category, metric, id } = product;

      console.log(PID);

      return processArray({
        SN,
        productName: name,
        productImage: image_url,
        categoryName: category.name,
        categoryId: category.id,
        measurement: metric.name,
        productId: id,
        specifications,
        PID,
        refetch,
        isVisible: product_visibility,
      });
    });

    return mapped.flat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts]);

  /**
   *
   * @returns {number}
   */
  function itemsCount() {
    if (!allProducts) return 0;
    if (!allProducts.data) return 0;

    return allProducts.data.products.length;
  }

  return (
    <DashboardWrapper pageTitle="Product Category">
      <TopPart refetch={refetch} itemsCount={itemsCount()} />

      <Box
        mt={"40px"}
        p={"40px 24px"}
        borderRadius="8px"
        backgroundColor={addTransparency("#f5852c", 0.04)}
      >
        <Flex gap={"24px"} wrap={"wrap"}>
          <Box>
            <Text color={"#F5852C"} fontWeight={600} fontSize={"20px"}>
              Product Category Manager
            </Text>
            <Text fontSize={"12px"} color={"primary"}>
              All items you have in your inventory is managed here
            </Text>
          </Box>

          <Spacer />

          <Flex align={"center"} gap={"24px"}>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />

            <Box hidden>
              <Filters setFilters={setFilters} />
            </Box>
          </Flex>
        </Flex>
        <Box mt={"24px"}>
          <ProductCategoryList
            tableColumns={tableColumns}
            tableData={newTable}
            isLoading={isLoading}
          />
        </Box>
      </Box>
      <AddAndEditCategoryModal
        onSuccess={() => refetch()}
        isOpen={openEditCategoryModal}
        closeModal={() => {
          setOpenEditCategoryModal(false);
          setRenderKey(!renderKey);
        }}
        action="edit"
        key={renderKey}
      />
    </DashboardWrapper>
  );
};

export default ProductCategories;
