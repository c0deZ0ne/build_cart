import {
  Box,
  Button as ChakraButton,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useMemo, useState } from "react";
import { FaAngleLeft, FaEnvelope, FaGlobe, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import { TiLocation } from "react-icons/ti";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/";
import Pattern from "../../../assets/images/card-pattern.svg";
import FundManagerProjectsList from "../../../components/Builder/FundManagers/FundManagerProjectList";
import Button from "../../../components/Button";
import CustomCheckBoxIcon from "../../../components/Checkmark/CustomCheckBox";
import Input from "../../../components/Input";
import StarRatings from "../../../components/StarRatings";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetFundManagerProfileQuery } from "../../../redux/api/builder/builder";
import { addTransparency } from "../../../utility/helpers";
import moment from "moment";

/**
 *
 * @param {object} props
 * @param {string} props.imageUrl
 * @param {string} props.about
 * @returns
 */
const JumboTron = ({ imageUrl, about }) => {
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
        width={"200px"}
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
            Fund Manager{" "}
          </Text>
        </Flex>

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

/**
 *
 * @param {object} props
 * @param {string} props.email
 * @param {string} props.phone
 * @param {number} props.completedProjectsCount
 * @param {string} props.location
 * @param {string} props.contactEmail
 * @returns
 */
function FundManagerInfo({
  email,
  phone,
  completedProjectsCount,
  location,
  contactEmail,
}) {
  return (
    <Grid
      templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
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
        <Flex alignItems={"center"} gap={"5px"} mt={"6px"}>
          <FaGlobe /> <Text>{contactEmail}</Text>
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
          <StarRatings rating={0} />

          <Text color={"primary"} fontWeight={600}>
            (0/5)
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
          <Text as="span">{location}</Text>
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
          Completed Projects
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
          <Text as="span">{completedProjectsCount}</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
}

const Filters = ({ setFilters }) => {
  const [generalFilters, setGeneralFilters] = useState({
    location: false,
    rating: false,
  });

  const [categoryFilter, setCategoryFilter] = useState({
    cement: false,
    aggregate: false,
  });

  const [statusFilter, setStatusFilter] = useState({
    active: false,
    pending: false,
    completed: false,
    dispute: false,
  });

  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  });

  const filters = useMemo(() => {
    return { ...categoryFilter, ...generalFilters };
  }, [categoryFilter, generalFilters]);

  function resetFilters() {
    setCategoryFilter({ cement: false, aggregate: false });
    setGeneralFilters({ location: false, rating: false });
    setDateFilter({ from: "", to: "" });
    setStatusFilter({
      active: false,
      pending: false,
      completed: false,
      dispute: false,
    });
  }

  function handleDate(e, key) {
    const dateFilterCopy = { ...dateFilter };
    dateFilterCopy[key] = e.target.value;
    setDateFilter(dateFilterCopy);
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
            <VStack spacing="16px" width={"100%"}>
              {Object.entries(generalFilters).map(([key, value]) => {
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
                      onChange={() =>
                        setGeneralFilters({ ...generalFilters, [key]: !value })
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

            <Box width={"100%"}>
              <Text fontSize={"12px"} fontWeight={600}>
                Status{" "}
              </Text>

              <VStack spacing="16px" mt="8px">
                {Object.entries(statusFilter).map(([key, value]) => {
                  return (
                    <Flex
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text color={"#333"} textTransform={"capitalize"}>
                        {capitalize(key)}
                      </Text>
                      <Checkbox
                        isChecked={value}
                        onChange={(e) =>
                          setStatusFilter({
                            ...statusFilter,
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
                Date
              </Text>

              <VStack spacing="16px" mt="8px">
                {Object.entries(dateFilter).map(([key, value]) => {
                  return (
                    <Box
                      key={key}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Text
                        color={"#333"}
                        textTransform={"capitalize"}
                        mb={"8px"}
                      >
                        {capitalize(key)}
                      </Text>
                      <Input
                        height={"40px"}
                        type="date"
                        min={moment().format("YYYY-MM-DD")}
                        borderRadius={"2px"}
                        value={value}
                        onChange={(e) => handleDate(e, key)}
                      />
                    </Box>
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

const FundManagerDetailsPage = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({});

  const { id } = useParams();

  const { data, isLoading } = useGetFundManagerProfileQuery(id);

  const dataNeeded = useMemo(() => {
    if (!data || !data.data) return;
    const { fundManager, completedProjectsCount } = data.data;

    const { email, phone, about, logo, businessAddress, contactEmail, id } =
      fundManager;
    return {
      email,
      phone,
      about,
      logo,
      businessAddress,
      contactEmail,
      completedProjectsCount,
      id,
    };
  }, [data]);

  return (
    <DashboardWrapper pageTitle="Fund Manager">
      <Box>
        <Box mb={"2rem"} width={"max-content"}>
          <ChakraButton
            onClick={() => history.goBack()}
            variant={"ghost"}
            leftIcon={<FaAngleLeft size={"24px"} strokeWidth={"1px"} />}
          >
            Back
          </ChakraButton>
        </Box>

        {dataNeeded && (
          <Box>
            <Grid
              gap={"24px"}
              mt={"32px"}
              templateColumns={{ base: "1fr", xl: "1.5fr 1fr" }}
            >
              <GridItem>
                <JumboTron
                  about={dataNeeded.about}
                  imageUrl={dataNeeded.logo}
                />
              </GridItem>
              <GridItem>
                <FundManagerInfo
                  email={dataNeeded.email}
                  phone={dataNeeded.phone}
                  completedProjectsCount={dataNeeded.completedProjectsCount}
                  location={dataNeeded.businessAddress}
                  contactEmail={dataNeeded.contactEmail}
                />
              </GridItem>
            </Grid>

            <Box
              bg={addTransparency("#F5852C", 0.04)}
              mt={"40px"}
              px="24px"
              py="40px"
            >
              <Flex alignItems={"center"} gap={"1rem"} wrap={"wrap"}>
                <Box lineHeight={"1"}>
                  <Text fontSize={"24px"} fontWeight={600} color={"secondary"}>
                    Fund Manager Projects
                  </Text>
                </Box>
                <Spacer />
                <Box width="max-content" position={"relative"}>
                  <Flex gap={"1rem"}>
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
                </Box>
              </Flex>
              <Box
                mt={"24px"}
                backgroundColor={"white"}
                borderRadius={"8px"}
                border="1px solid #F0F1F1"
              >
                <FundManagerProjectsList
                  searchTerm={searchTerm}
                  fundManagerId={dataNeeded.id}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </DashboardWrapper>
  );
};

export default FundManagerDetailsPage;
