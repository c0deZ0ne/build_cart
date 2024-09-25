import { Box, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useGetProductsByCategoryQuery } from "../../redux/api/product/productSlice";
import Button from "../Button";
import CustomSelect from "../CustomSelect/CustomSelect";
import BaseModal from "../Modals/Modal";
import SelectSearchAlt from "../SelectSearchAlt";
/**
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.closeModal
 * @param {() => void} props.addItem
 * @returns
 */
const AddItemToCategoryModal = ({
  isOpen,
  closeModal,
  addItem,
  categoryId,
}) => {
  const { data: products } = useGetProductsByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const formSchema = yup.object({
    name: yup.object().required("Name is required").required(),
    specification: yup.object().required("Spec is required"),
    metrics: yup.object().required("Metric is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      specification: "",
      metrics: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = methods;

  /**
   * @type {{id: string, name: string, specs: {id: string, name: string}[], metric: {value: string, label: string}}[]}
   */
  const productsData = useMemo(() => {
    if (!products || !products.data) return [];

    return products.data.map((p) => {
      return {
        id: p.id,
        name: p.name,
      };
    });
  }, [products]);

  const [itemSpecs, setItemSpecs] = useState([]);
  const [itemMetrics, setItemMetrics] = useState([]);

  useEffect(() => {
    const subscription = watch(({ name }) => {
      if (name && name.id) {
        if (!products) return;
        const itemId = name.id;
        const product = products.data.find((p) => p.id === itemId);
        if (product) {
          const specs = product.specifications.map((s) => {
            return {
              value: s.id,
              label: s.value,
            };
          });
          const metric = {
            value: product.metric.id,
            label: product.metric.name,
          };
          setItemSpecs(specs);
          setItemMetrics([metric]);
        }
      }

      return () => subscription.unsubscribe();
    });
  }, [products, watch]);

  const onSubmit = (data) => {
    console.log({ data });

    addItem(data);
    closeModal();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Item"
      subtitle="Include products you have under this category."
      bodyOverflow="initial"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my="0">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Item Name
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Controller
            name="name"
            defaultValue=""
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectSearchAlt
                options={productsData}
                setSelectOption={onChange}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <div style={{ color: "red" }}>
            {errors["name"] ? errors["name"]?.message : ""}
          </div>
        </Box>

        <Box mt="24px">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Item Specification
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Controller
            name="specification"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box>
                <CustomSelect
                  placeholder="Select Project Specification"
                  onChange={onChange}
                  value={value}
                  options={itemSpecs}
                />
                <div style={{ color: "red" }}>
                  {errors["specification"]
                    ? errors["specification"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box mt="24px">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Item Metrics
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Controller
            name="metrics"
            defaultValue=""
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box>
                <CustomSelect
                  placeholder="Select Project Metrics"
                  onChange={onChange}
                  value={value}
                  options={itemMetrics}
                />
                <div style={{ color: "red" }}>
                  {errors["metrics"] ? errors["metrics"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>

        <Box mt={"63px"}>
          <Button full isSubmit={true}>
            Add Item
          </Button>
        </Box>
      </form>
    </BaseModal>
  );
};

export default AddItemToCategoryModal;
