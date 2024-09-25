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
import { RiSearch2Line } from "react-icons/ri";
import { TiLocation } from "react-icons/ti";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Pattern from "../../assets/images/card-pattern.svg";
import Input from "../../components/Input";
import StarRatings from "../../components/StarRatings";
import DashboardWrapper from "../../layouts/dashboard";
import {
  useAddBuildersToFundManagersProfileMutation,
  useGetBuilderDetailsQuery,
} from "../../redux/api/fundManager/fundManager";

const ProjectGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Box>
      <Flex gap={"24px"} wrap={"wrap"} mb={"40px"} align={"flex-end"}>
        <Box>
          <Text color={"primary"} fontSize={"24px"} fontWeight={600}>
            Completed Projects
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
        </Flex>
      </Flex>
      {Array.from({ length: 3 }).map((p, jdx) => {
        return (
          <Box mb={"40px"} key={jdx}>
            <Text fontSize={"24px"} fontWeight={600} mb={"24px"}>
              Project {jdx + 1}
            </Text>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              gap={"40px 24px"}
            >
              {Array.from({ length: 4 }).map((i, idx) => {
                return (
                  <GridItem
                    borderRadius={"8px"}
                    key={idx}
                    overflow={"hidden"}
                    boxShadow={"md"}
                  >
                    <Box>
                      <Image
                        w={"100%"}
                        maxWidth={"100%"}
                        height={"180px"}
                        src="https://placehold.it/240x240"
                        alt=""
                        objectFit={"cover"}
                      />
                    </Box>
                    <Flex
                      gap={"8px"}
                      p={"14px"}
                      //   bg="palegoldenrod"
                      alignItems={"center"}
                    >
                      <Image
                        height={"21px"}
                        width={"21px"}
                        borderRadius={"50%"}
                        src="http://unsplash.it/240?gravity=center"
                      />
                      <Text fontSize={"14px"} color={"#211F5C"}>
                        Lekki Ikoyi link bridge
                      </Text>
                    </Flex>
                  </GridItem>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

const BuilderInfoGrid = ({ email, phone, address, rating }) => {
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
          LOCATION
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
          <Text as="span">{address}</Text>
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
          <Text as="span">{0}</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const JumboTron = ({ name, imageUrl, about, builderId }) => {
  // const [addToMyVendors, { error, isLoading, isSuccess, isError }] =
  //   useAddToMyVendorsMutation();

  const toast = useToast();

  // function addVendor() {
  //   addToMyVendors(vendorId);
  // }

  // useEffect(() => {
  //   if (!isSuccess) return;

  //   toast({
  //     status: "success",
  //     description: "Supplier added to favourite's list",
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess]);

  // useEffect(() => {
  //   if (!isError) return;
  //   toast({
  //     status: "error",
  //     description: error.data.message,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isError, error]);

  const [addToMyBuildersFn, { isLoading, isSuccess, isError, error }] =
    useAddBuildersToFundManagersProfileMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        status: "success",
        description: `${name} has been added to favourite's list`,
      });
    }

    if (isError) {
      toast({
        status: "error",
        description: error.data.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess]);

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
        borderRadius="8px"
        objectFit={"cover"}
        src={"https://placehold.it/200x200"}
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
            {name}
          </Text>

          <ChakraButton
            variant="unstyled"
            onClick={() => addToMyBuildersFn([builderId])}
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
          Builder
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

const SingleBuilderDetails = () => {
  const history = useHistory();

  const { builderId } = useParams();

  const { data } = useGetBuilderDetailsQuery(builderId);

  const neededData = useMemo(() => {
    if (!data) return;
    if (!data.data) return;
    if (!data.data.builder) return;

    const { builderRateData, completedProjectsCount } = data.data;
    const { about, businessName, email, businessAddress, phoneNumber, id } =
      data?.data?.builder;

    return {
      name: businessName,
      about,
      email,
      businessAddress,
      id,
      phone: phoneNumber,
      rating: builderRateData,
      completedProjectsCount,
    };
  }, [data]);

  return (
    <DashboardWrapper pageTitle="Builder Details">
      <Box width={"max-content"} mb={"40px"}>
        <ChakraButton
          onClick={() => history.goBack()}
          variant={"ghost"}
          leftIcon={<FaAngleLeft size={"24px"} strokeWidth={"1px"} />}
        >
          Back
        </ChakraButton>
      </Box>

      {neededData && (
        <Box>
          <Grid
            templateColumns={{ base: "1fr", xl: "1.5fr 1fr" }}
            gap={"24px"}
            // alignItems={"normal"}
          >
            <GridItem>
              <JumboTron
                name={neededData?.name}
                about={neededData?.about}
                imageUrl={""}
                builderId={neededData?.id}
              />
            </GridItem>

            <GridItem>
              <BuilderInfoGrid
                email={neededData?.email}
                phone={neededData?.phone}
                rating={neededData?.rating}
                address={neededData?.businessAddress}
              />
            </GridItem>
          </Grid>

          <Box mt={"40px"}>
            <ProjectGrid></ProjectGrid>
          </Box>
        </Box>
      )}
    </DashboardWrapper>
  );
};

export default SingleBuilderDetails;
