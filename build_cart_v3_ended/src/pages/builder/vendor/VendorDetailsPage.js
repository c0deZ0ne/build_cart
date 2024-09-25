import {
  Box,
  Button as ChakraButton,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleLeft, FaEnvelope, FaHeart, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import { TiLocation } from "react-icons/ti";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import Pattern from "../../../assets/images/card-pattern.svg";
import EmptyState from "../../../components/EmptyState";
import Input from "../../../components/Input";
import StarRatings from "../../../components/StarRatings";
import BaseTable from "../../../components/Table";
import useDebounce from "../../../hook/useDebounce";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  useAddToMyVendorsMutation,
  useGetSingleVendorByIdQuery,
  useGetVendorsProductsByVendorIdQuery,
} from "../../../redux/api/builder/builder";

const tableColumns = [
  "S/N",
  "PRODUCT NAME",
  "PRODUCT CATEGORY",
  "SPECIFICATION",
  "STATUS",
];

const ProductsTable = ({ vendorId, searchTerm }) => {
  const { data, isLoading } = useGetVendorsProductsByVendorIdQuery({
    vendorId,
    searchTerm,
  });

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const mapped = data.data.products.map((p, index) => {
      const { product, specifications, product_visibility } = p;
      const { name, category } = product;
      const { name: categoryName } = category;

      const specs = specifications.map((spec) => spec.value).join(", ");

      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "PRODUCT NAME": name,
        "PRODUCT CATEGORY": categoryName,
        SPECIFICATION: specs,
        STATUS: product_visibility ? "Available" : "Out of Stock",
      };
    });

    return mapped;
  }, [data]);

  return (
    <BaseTable
      isLoading={isLoading}
      tableBody={tableData}
      tableColumn={tableColumns}
      empty={
        <EmptyState>
          <Text>Nothing to see here...</Text>
        </EmptyState>
      }
    />
  );
};

const VendorInfo = ({ email, phone, businessAddress, rating }) => {
  return (
    <Grid
      templateColumns={{ sm: "1fr 1fr", xl: "1fr 1fr" }}
      color={"#666"}
      fontSize={"12px"}
      gap={"1.5rem"}
      width={"100%"}
    >
      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          CONTACT INFORMATION
        </Text>

        <Flex alignItems={"center"} gap={"5px"}>
          <FaEnvelope /> <Text>{email}</Text>
        </Flex>
        <Flex alignItems={"center"} gap={"5px"} mt={"6px"}>
          <FaPhoneAlt /> <Text>{phone}</Text>
        </Flex>
      </GridItem>

      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          Ratings{" "}
        </Text>

        <Box display={"flex"} justifyContent={"space-between"} gap={"0.5rem"}>
          <StarRatings rating={rating} />

          <Text color={"primary"} fontWeight={600}>
            ({rating}/5)
          </Text>
        </Box>
      </GridItem>

      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          COMPANY LOCATION
        </Text>

        <Flex alignItems={"center"} fontSize={"1.25rem"} gap={"0.5rem"}>
          <Box
            height={"2.5rem"}
            width={"2.5rem"}
            borderRadius={"50%"}
            backgroundColor={"rgba(18, 53, 90, 0.16)"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TiLocation color="#12355A" size={"24px"} />
          </Box>
          <Text as="span">{businessAddress}</Text>
        </Flex>
      </GridItem>

      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          Completed Orders
        </Text>

        <Flex alignItems={"center"} fontSize={"1.25rem"} gap={"0.5rem"}>
          <Box
            height={"2.5rem"}
            width={"2.5rem"}
            borderRadius={"50%"}
            backgroundColor={"rgba(18, 53, 90, 0.16)"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <MdOutlineWatchLater color="#12355A" size={"24px"} />
          </Box>
          <Text as="span">{0}</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const VendorJumboTron = ({ businessName, imageUrl, about, vendorId }) => {
  const [addToMyVendors, { error, isLoading, isSuccess, isError }] =
    useAddToMyVendorsMutation();

  const toast = useToast();

  function addVendor() {
    addToMyVendors(vendorId);
  }

  useEffect(() => {
    if (!isSuccess) return;

    toast({
      status: "success",
      description: "Supplier added to favourite's list",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    toast({
      status: "error",
      description: error.data.message,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return (
    <Flex
      background={"primary"}
      p={"24px"}
      gap={"1.5rem"}
      borderRadius={"8px"}
      maxWidth={"100%"}
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      <Image
        minHeight="200px"
        maxWidth="200px"
        minWidth={"220px"}
        borderRadius="8px"
        objectFit={"cover"}
        src={imageUrl}
      ></Image>
      <Box color={"white"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"1rem"}
        >
          <Text
            fontSize={{ base: "32px", md: "40px" }}
            fontWeight={"600"}
            as={"h1"}
            lineHeight={1}
          >
            {businessName}
          </Text>

          <ChakraButton
            variant="unstyled"
            onClick={() => addVendor(vendorId)}
            isLoading={isLoading}
          >
            <FaHeart size={"1.5rem"} color="white" />
          </ChakraButton>
        </Flex>
        <ChakraButton
          mt={"0.5rem"}
          backgroundColor={"rgba(255,255,255, 0.16)"}
          color={"white"}
          borderRadius={"40px"}
          size={"sm"}
        >
          Vendor
        </ChakraButton>
        <Box mt={"1rem"}>
          <Text fontSize="12px" fontWeight={"600"}>
            Info
          </Text>

          <Text
            fontSize={{ base: "14px", md: "1rem" }}
            lineHeight={"24px"}
            mt={"0.5rem"}
            pr="1rem"
          >
            {about}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

const VendorDetailsPage = () => {
  const history = useHistory();

  const { vendorId } = useParams();

  const { data } = useGetSingleVendorByIdQuery(vendorId);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const neededData = useMemo(() => {
    if (!data) return;

    if (data.data) {
      const {
        id,
        businessName,
        businessContactId,
        email,
        phone,
        about,
        VendorType,
        businessAddress,
      } = data.data;

      const { rating } = data.data.vendorStats;

      return {
        imageUrl: businessContactId,
        businessName,
        email,
        phone,
        about,
        VendorType,
        rating,
        id,
        businessAddress,
      };
    }
  }, [data]);

  return (
    <DashboardWrapper
      pageTitle="Overview"
      handleProjectData=""
      projectOptions=""
    >
      <Box mb={"2rem"}>
        <ChakraButton
          onClick={() => history.goBack()}
          variant={"ghost"}
          leftIcon={<FaAngleLeft size={"24px"} strokeWidth={"1px"} />}
        >
          Back
        </ChakraButton>
      </Box>

      {neededData ? (
        <Box>
          <Flex
            gap={"24px"}
            p={"0.1rem"}
            flexWrap={{ base: "wrap", xl: "nowrap" }}
          >
            <VendorJumboTron
              imageUrl={neededData.imageUrl}
              about={neededData.about}
              businessName={neededData.businessName}
              vendorId={neededData.id}
            />
            <VendorInfo
              businessAddress={neededData.businessAddress}
              email={neededData.email}
              phone={neededData.phone}
              rating={neededData.rating}
            />
          </Flex>

          <Box
            mt={"40px"}
            position={"relative"}
            borderRadius={"8px"}
            p={"32px 24px"}
            background={"#FCF7F6"}
          >
            <Flex
              gap={"1rem"}
              justifyContent={"space-between"}
              direction={["column", "column", "row"]}
              flexWrap={{ base: "wrap", sm: "nowrap" }}
            >
              <Box width={"max-content"}>
                <Text fontWeight={600} fontSize={"20px"} color={"secondary"}>
                  {neededData.businessName}
                </Text>

                <Text color={"#333"}>Product Category</Text>
              </Box>
              <Spacer />
              <Box
                width={{ base: "100%", sm: "max-content" }}
                position={"relative"}
              >
                <Flex gap={"1rem"} flexWrap={{ base: "wrap", sm: "nowrap" }}>
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<RiSearch2Line />}
                  />
                  <Box
                    hidden
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
                </Flex>
              </Box>
            </Flex>

            <Box mt={"24px"}>
              <ProductsTable
                vendorId={vendorId}
                searchTerm={debouncedSearchTerm}
              />
            </Box>
          </Box>
        </Box>
      ) : null}
    </DashboardWrapper>
  );
};

export default VendorDetailsPage;
