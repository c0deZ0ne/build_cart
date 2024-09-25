import {
  Box,
  Button as ChakraButton,
  Divider,
  Flex,
  Grid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope, FaTimesCircle } from "react-icons/fa";
import { FaNairaSign } from "react-icons/fa6";
import * as yup from "yup";
import Button from "../../../../components/Button";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import GalleryEdit from "../../../../components/Icons/GalleryEdit";
import Input from "../../../../components/Input";
import BaseModal from "../../../../components/Modals/Modal";
import SuccessMessage from "../../../../components/SuccessMessage";
import {
  useGetAllMetricsQuery,
  useGetAllSpecificationsQuery,
} from "../../../../redux/api/api";
import {
  useCreateCategoryAndProductsMutation,
  useGetAllProductCategoriesQuery,
} from "../../../../redux/api/super-admin/superAdminSlice";
import { uploadImage } from "../../../../utility/queries";

/**
 *
 * @typedef {{value: string, label: string}} CategoryItem
 * @param {{isOpen: boolean, onClose: () => void, isEditting: boolean, categoryToEdit?: CategoryItem, refetch: Function}} props
 * @returns
 */
export default function CreateCategory({
  isOpen,
  onClose,
  isEditting = false,
  categoryToEdit = null,
}) {
  const toast = useToast;
  const [savedItems, setSavedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [
    createFn,
    {
      isLoading: isSubmitting,
      isError: submitFailed,
      isSuccess: submitSuccessful,
      error: submitError,
    },
  ] = useCreateCategoryAndProductsMutation();

  const {
    data: productCategoriesData,
    refetch,
    isLoading: productCategoriesDataLoading,
  } = useGetAllProductCategoriesQuery();
  const { data: specsData, isLoading: specsDataLoading } =
    useGetAllSpecificationsQuery({ pageSize: 100 });
  const { data: measurementData, isLoading: measurementDataLoading } =
    useGetAllMetricsQuery({ pageSize: 100 });

  /**
   * @typedef {{value: string, label: string}} specOption
   * @type {Array<specOption>}
   */
  const specsOptions = useMemo(() => {
    if (!specsData) return [];
    if (!specsData.data) return [];

    const mapped = specsData.data.map((spec) => {
      return {
        value: spec.id,
        label: spec.value,
      };
    });

    return mapped;
  }, [specsData]);

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

  const categoriesData = useMemo(() => {
    if (!productCategoriesData) return [];
    if (!productCategoriesData.data) return [];

    const mapped = productCategoriesData.data.map((cat, index) => {
      const { id, name } = cat;

      return {
        value: id,
        label: name,
      };
    });

    return mapped;
  }, [productCategoriesData]);

  const formSchema = yup.object({
    category: yup
      .object()
      .shape({
        label: yup.string(),
        value: yup.string(),
      })
      .required("is required")
      .typeError("is required"),
    item: yup
      .object()
      .shape({
        name: yup.string().required("name is required"),
        minPrice: yup
          .number()
          .required("min price is required")
          .typeError("min price must be a number"),
        maxPrice: yup
          .number()
          .required("max price is required")
          .typeError("max price must be a number")
          .test(
            "must-be-more",
            "max price should be greater or equal to min price",
            function () {
              const { minPrice, maxPrice } = this.parent;

              return maxPrice >= minPrice;
            }
          ),
        measurement: yup
          .object()
          .shape({
            label: yup.string(),
            value: yup.string(),
          })
          .required("is required"),
        specs: yup
          .array()
          .of(
            yup.object().shape({
              label: yup.string(),
              value: yup.string(),
            })
          )
          .min(1, "At least one spec"),
        file: yup
          .mixed()
          .required("file is required")
          .typeError("file is required"),
      })
      .required(),
  });

  const methods = useForm({
    defaultValues: {
      category: categoryToEdit,
      item: {
        name: "",
        minPrice: "",
        maxPrice: "",
        specs: [],
        measurement: null,
        file: null,
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

  async function handleSaveItem() {
    const isValid = await trigger();

    if (!isValid) return;

    const { item } = getValues();
    setSavedItems((currentItems) => [...currentItems, item]);
    resetField("item");
    resetField("item.minPrice");
    resetField("item.maxPrice");
    resetField("item.specs");
    resetField("item.measurement");
    resetField("item.file");
    // console.log(output, errors);
  }

  function removeSavedItem(idx) {
    const copy = [...savedItems];

    copy.splice(idx, 1);

    setSavedItems(copy);
  }

  const inputRef = useRef();

  function handleClick() {
    inputRef.current.click();
  }

  function handleChange(e) {
    const files = e.target.files;

    if (!files) return;

    setValue("item.file", files[0]);
  }

  async function onSubmit(data) {
    const { item } = data;
    const allItems = [...savedItems, item];

    try {
      setIsUploading(true);
      async function uploadIt(file) {
        const { url } = await uploadImage(file, "", () => {});
        return url;
      }
      const mappedRequest = allItems.map((item) => uploadIt(item.file));
      const urls = await Promise.all(mappedRequest);
      const dataToSubmit = {
        name: data.category.label,
        items: allItems.map((item, idx) => {
          return {
            name: item.name,
            image: urls[idx],
            metricId: item.measurement.value,
            specsAndPrices: item.specs.map((spec) => ({
              specification: spec.label,
              price: null,
            })),
            priceRange: `${item.minPrice} - ${item.maxPrice}`,
          };
        }),
      };

      createFn(dataToSubmit);
    } catch (error) {
      toast({
        status: "error",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (submitSuccessful) {
      setShowSuccessMessage(true);
      refetch();
    }
    if (submitFailed && submitError) {
      toast({ status: "error", description: submitError.data.message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitError, submitFailed, submitSuccessful]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        title="Add Category"
        subtitle="Create a category to add to your list of existing categories"
        showHeader={!showSuccessMessage}
      >
        {showSuccessMessage ? (
          <SuccessMessage message="Category created successfully." />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid gap={"20px"}>
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Category Name{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="category"
                  defaultValue={null}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <CustomSelect
                        options={categoriesData}
                        value={value}
                        onChange={onChange}
                        isDisabled={productCategoriesDataLoading || isEditting}
                        isLoading={productCategoriesDataLoading}
                        placeholder="Select or type in product Specification"
                      />
                      <div style={{ color: "red" }}>
                        {errors.category ? errors.category?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              {savedItems.length > 0 && (
                <Box>
                  <Grid
                    templateColumns={"1fr 1fr"}
                    columnGap={"24px"}
                    rowGap={"16px"}
                  >
                    {savedItems.map((item, idx) => {
                      return (
                        <Flex
                          key={idx}
                          alignItems={"center"}
                          backgroundColor={"#F0F1F1"}
                          borderRadius={"80px"}
                          pl={"24px"}
                          pr={"16px"}
                          py={"12px"}
                          justifyContent={"space-between"}
                        >
                          <Box>
                            <Text
                              fontSize={"12px"}
                              fontWeight={500}
                              color={"#333333"}
                            >
                              {item.name}
                            </Text>
                            <Text fontSize={"8px"}>
                              {item.specs.map((i) => i.label).join(", ")},{" "}
                              {item.measurement.label}
                            </Text>
                          </Box>

                          <ChakraButton
                            height={"24px"}
                            width={"24px"}
                            minWidth={"16px"}
                            borderRadius={"50%"}
                            p={0}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            mr={"10px"}
                            onClick={() => {
                              removeSavedItem(idx);
                            }}
                          >
                            <FaTimesCircle size={"16px"} />
                          </ChakraButton>
                        </Flex>
                      );
                    })}
                  </Grid>
                </Box>
              )}
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Item name{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="item.name"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Input
                        type={"text"}
                        value={value}
                        onChange={onChange}
                        placeholder="Item Name"
                        leftIcon={<FaEnvelope />}
                      />
                      <div style={{ color: "red" }}>
                        {errors.item?.name ? errors.item?.name.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Item Image{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="item.file"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Flex
                        backgroundColor="#F6F7F8"
                        height={"40px"}
                        borderRadius={"8px"}
                        align={"center"}
                        justify={"center"}
                        onClick={handleClick}
                      >
                        <GalleryEdit></GalleryEdit>
                        <Text
                          color={"#999999"}
                          fontSize={"14px"}
                          ml={"8px"}
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          maxWidth={"320px"}
                        >
                          {value ? value.name : "Click to upload file"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={inputRef}
                            onChange={handleChange}
                          />
                        </Text>
                      </Flex>

                      <div style={{ color: "red" }}>
                        {errors.item?.file ? errors.item?.file.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              {/* SPECS */}
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Item Specifications{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>

                <Controller
                  name="item.specs"
                  defaultValue={[]}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <CustomSelect
                        options={specsOptions}
                        value={value}
                        onChange={onChange}
                        isDisabled={specsDataLoading}
                        isLoading={specsDataLoading}
                        isMulti
                        controlShouldRenderValue={false}
                        placeholder="Select or type in product Specification"
                      />

                      {value.length > 0 && (
                        <Flex
                          mt={"12px"}
                          mb={"0"}
                          columnGap={"24px"}
                          rowGap={"12px"}
                          wrap={"wrap"}
                        >
                          {value.map((v, idx) => {
                            return (
                              <Flex
                                key={v.value}
                                borderRadius={"50px"}
                                width={"max-content"}
                                py={"10px"}
                                align={"center"}
                                color="#333333"
                                backgroundColor={"#F0F1F1"}
                                height={"37.48px"}
                                fontWeight={700}
                                fontSize={"12px"}
                              >
                                <Text px={"21px"}>{v.label}</Text>

                                <ChakraButton
                                  height={"16px"}
                                  width={"16px"}
                                  minWidth={"16px"}
                                  borderRadius={"50%"}
                                  p={0}
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                  mr={"10px"}
                                  onClick={() => {
                                    const copy = [...value];

                                    copy.splice(idx, 1);

                                    onChange(copy);
                                  }}
                                >
                                  <FaTimesCircle size={"12px"} />
                                </ChakraButton>
                              </Flex>
                            );
                          })}
                        </Flex>
                      )}
                      <div style={{ color: "red" }}>
                        {errors.item?.specs ? errors.item.specs?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              {/* MEASUREMENT */}
              <Box>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Item Measurement{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>

                <Controller
                  name="item.measurement"
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
                        placeholder="Select or type in product measurement"
                      />

                      <div style={{ color: "red" }}>
                        {errors.item?.measurement
                          ? errors.item?.measurement?.message
                          : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

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
                    name="item.minPrice"
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
                    name="item.maxPrice"
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
                  {errors.item?.minPrice
                    ? errors.item?.minPrice?.message
                    : errors.item?.maxPrice
                    ? errors.item?.maxPrice?.message
                    : ""}
                </div>
              </Box>
            </Grid>

            <Box w="100%" mt={"16px"} mb="40px">
              <Button
                border="1px solid #12355A"
                color="primary"
                width="100%"
                background="white"
                onClick={handleSaveItem}
              >
                + Add Item
              </Button>
            </Box>

            <Button full isSubmit isLoading={isUploading || isSubmitting}>
              Create
            </Button>
          </form>
        )}
      </BaseModal>
    </>
  );
}
