import {
  Box,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import * as yup from "yup";
import { useGetAllProductCategoriesQuery } from "../../redux/api/product/productSlice";
import { useAddProductsToVendorMutation } from "../../redux/api/vendor/vendor";
import Button from "../Button";
import BaseModal from "../Modals/Modal";
import SelectSearchAlt from "../SelectSearchAlt";
import AddItemToCategoryModal from "./AddItemToCategoryModal";

/**
 *
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.spec
 * @param {string} props.metrics
 * @param {() => void} props.deleteItem
 * @returns
 */
const SingleItem = ({ name, spec, metrics, deleteItem }) => {
  return (
    <Box
      background="#F0F1F1"
      borderRadius={"80px"}
      py={"13px"}
      pl={"24px"}
      pr={"16px"}
    >
      <Flex>
        <Box color={"#333"}>
          <Text fontWeight={500} fontSize={"12px"}>
            {name}
          </Text>
          <Text fontSize={"8px"}>
            {spec} . {metrics}
          </Text>
        </Box>
        <Spacer />
        <button onClick={deleteItem}>
          <IoCloseCircleSharp size={"24px"} color="#12355A" />
        </button>
      </Flex>
    </Box>
  );
};

/**
 *
 * @param {object} props
 * @param {'edit' | 'add'} props.action
 * @param {boolean} props.isOpen
 * @param {() => void} props.closeModal
 * @param {() => void} props.onSuccess
 * @param {string} props.defaultCategoryID
 * @returns
 */
const AddAndEditCategoryModal = ({
  action = "add",
  isOpen,
  closeModal,
  onSuccess,
  defaultCategoryID = "",
}) => {
  const [categoryId, setCategoryId] = useState(defaultCategoryID);
  const [select, setSelect] = useState();
  const [openAddItemModal, setOpenAddItemModal] = useState(!true);
  const [renderKey, setRenderKey] = useState(true);

  const [items, setItems] = useState([]);

  const { data: categories } = useGetAllProductCategoriesQuery();
  const [
    addFn,
    { isLoading: isAdding, isSuccess: addSuccessful, isError, error },
  ] = useAddProductsToVendorMutation();

  const toast = useToast();

  /**
   * @type {{id: string, name: string}[]}
   */
  const categoriesData = useMemo(() => {
    if (!categories || !categories.data) return [];
    return categories.data.map((c) => {
      return { id: c.id, name: c.name };
    });
  }, [categories]);

  useEffect(() => {
    if (!select) return;
    setCategoryId(select.id);
    setItems([]);
  }, [select]);

  useEffect(() => {
    const cate = categoriesData.find((c) => c.id === categoryId);
    if (cate) {
      setSelect(cate);
    }
  }, [categoryId, categoriesData]);

  const formSchema = yup.object({
    name: yup.string().required("Name is required").required(),
    email: yup.string().required("Email is required").email(),
    phone: yup.string().required("Phone number is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  function handleAddItem(item) {
    setItems((prev) => {
      const copy = [...prev];
      copy.push(item);
      return copy;
    });
  }

  function handleDeleteItem(index) {
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  function onSubmit() {
    // addFn(itemsIds);

    const data = items.map((item) => {
      return {
        productId: item.name.id,
        specsAndPrices: [
          {
            specification: item.specification.label,
            price: null,
          },
        ],
      };
    });

    // const products = {
    //   products: data,
    // };

    console.log(data);

    addFn(data);
  }

  useEffect(() => {
    if (addSuccessful) {
      toast({ status: "success", description: "Items Added!" });
      onSuccess();
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSuccessful]);

  useEffect(() => {
    if (isError) {
      toast({
        description: error.data.message,
        status: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={`${action === "add" ? "Add" : "Edit"} Category`}
      subtitle={
        action === "add"
          ? "Create a category to add to your list of existing categories"
          : "Add an item to your list of products under this category."
      }
      bodyOverflow="initial"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ pointerEvents: isAdding ? "none" : "auto" }}
      >
        <Box my="0">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Category Name
            <Text as={"span"} ml={2} color={"red"}>
              *
            </Text>
          </Text>
          {/* <SelectSearch
            data={categoriesData}
            setSelectOption={setSelect}
            selectOption={select}
          /> */}
          <SelectSearchAlt
            disabled={action === "edit"}
            options={categoriesData}
            value={select}
            onChange={setSelect}
          />
        </Box>

        <Grid my={"24px"} templateColumns={"1fr 1fr"} gap={"24px"}>
          {items.map((item, index) => {
            return (
              <GridItem key={index}>
                <SingleItem
                  name={item.name.name}
                  spec={item.specification.label}
                  metrics={item.metrics.label}
                  deleteItem={handleDeleteItem}
                />
              </GridItem>
            );
          })}
        </Grid>

        <Box>
          <Button
            leftIcon={<FaPlus />}
            background="transparent"
            color="#12355a"
            border={"1px solid #12355a"}
            full
            onClick={() => setOpenAddItemModal(true)}
          >
            Add Item
          </Button>
        </Box>

        <Box mt={"40px"}>
          <Button full onClick={onSubmit} isLoading={isAdding}>
            {action === "add" ? "Create" : "Update"}
          </Button>
        </Box>
      </form>

      <AddItemToCategoryModal
        categoryId={categoryId}
        key={renderKey}
        isOpen={openAddItemModal}
        closeModal={() => {
          setOpenAddItemModal(false);
          setRenderKey(!renderKey);
        }}
        addItem={handleAddItem}
      />
    </BaseModal>
  );
};

export default AddAndEditCategoryModal;
