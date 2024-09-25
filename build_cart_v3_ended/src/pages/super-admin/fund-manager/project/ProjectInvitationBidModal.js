import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { TiLocation } from "react-icons/ti";
import Pattern from "../../../../assets/images/card-pattern.svg";
import ExcelIcon from "../../../../assets/images/excel.svg";
import PdfIcon from "../../../../assets/images/pdf2.svg";
import PowerPointIcon from "../../../../assets/images/powerpoint2.svg";
import WordIcon from "../../../../assets/images/word.svg";
import defaultProjectImage from "../../../../assets/images/project-image.svg";
import {
  addTransparency,
  getFileExtension,
  handleError,
} from "../../../../utility/helpers";
import Button from "../../../../components/Button";
import BaseModal from "../../../../components/Modals/Modal";
import moment from "moment";
import { useFundManagerAcceptBidMutation } from "../../../../redux/api/super-admin/fundManagerSlice";
import SuccessMessage from "../../../../components/SuccessMessage";

/**
 *
 * @param {{url: string, title: string}} props
 * @returns
 */
const FilePreview = ({ url, title }) => {
  const extension = getFileExtension(url).toLowerCase();
  const [fileSize, setFileSize] = useState(0);

  const getIconAndColor = (extension) => {
    let icon, color;

    switch (extension) {
      case "ppt":
        icon = PowerPointIcon;
        color = "#D33922";
        break;
      case "doc":
        icon = WordIcon;
        color = "#1C60C0";
        break;
      case "xls":
        icon = ExcelIcon;
        color = "#21A366";
        break;
      case "pdf":
        icon = PdfIcon;
        color = "#DD2025";
        break;
      default:
        icon = null; // Use a default icon or handle this case accordingly
        color = "#000000";
        break;
    }

    return { icon, color };
  };

  const { icon, color } = getIconAndColor(extension);

  function initiateDownload(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = url;
    link.target = "_blank";
    link.click();
  }

  useEffect(() => {
    fetch(url, { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          const size = response.headers.get("content-length");
          setFileSize(size);
        } else {
          console.error("Failed to fetch image:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [url]);

  return (
    <Box width={"208px"} maxWidth={"208px"} flexGrow={"1"} flexShrink={0}>
      <Box
        borderRadius={"8px"}
        overflow={"hidden"}
        boxShadow={"0px 0px 8px 1px rgba(18, 53, 90, 0.04)"}
        //   border={"1px solid red"}
      >
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          background={addTransparency(color, 0.08)}
          py={"30px"}
        >
          <Image src={icon} height={"80px"} width={"80px"} />
        </Flex>
        <Box py={"8px"} px={"16px"} overflow={"hidden"}>
          <Text
            color={"#666666"}
            fontSize={"14px"}
            fontWeight={600}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            {title}
          </Text>
          <Text fontSize={"12px"} textTransform={"uppercase"}>
            {extension}
          </Text>
          <Text fontSize={"12px"}>{fileSize}kb</Text>
        </Box>
      </Box>

      <Box textAlign={"center"} mt={"16px"}>
        <Button
          background={addTransparency("#12355A", 0.08)}
          color="#12355A"
          onClick={() => initiateDownload(url)}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

/**
 *
 * @param {object} props
 * @param {Function} props.closeModal
 * @param {boolean} props.isOpen
 * @param {string} props.bidId
 * @returns
 */
const ProjectBidModal = ({
  bidDetail,
  project,
  closeModal,
  isOpen,
  refetch,
}) => {
  const [fundManagerAcceptBid, { isLoading, isSuccess, error, isError }] =
    useFundManagerAcceptBidMutation();

  const acceptBid = () => {
    fundManagerAcceptBid({ projectId: project.id, bidId: bidDetail?.bidId });
  };

  useEffect(() => {
    if (isError) {
      handleError(error);
    }

    if (isSuccess) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return (
    <BaseModal
      onClose={closeModal}
      isOpen={isOpen}
      title="Invite Vendor"
      subtitle="The copy here would explain what the supplier would be doing"
      showHeader={false}
      size="4xl"
    >
      {isSuccess ? (
        <SuccessMessage message="Project has been successfully awarded." />
      ) : (
        <Box mt={"24px"}>
          <Flex
            p="24px"
            backgroundColor={"#12355A"}
            color={"#fff"}
            alignItems={"flex-start"}
            gap={"24px"}
            borderRadius={"8px"}
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            {/* <Box
              width="212px"
              height="233px"
              background={"rebeccapurple"}
              flexShrink={0}
              borderRadius={"8px"}
              overflow={"hidden"}
            >
              <Image
                src={"http://unsplash.it/200/200?random&gravity=center"}
                height={"100%"}
                width={"100%"}
              />
            </Box> */}

            <Box
              width={["100%", "100%", "400px", "40%"]}
              backgroundImage={project?.image || defaultProjectImage}
              bgRepeat="no-repeat"
              bgColor="rgba(255,255,255,1)"
              height="233px"
              rounded="8px"
              bgSize="cover"
            ></Box>
            <Box>
              <Text as="h2" fontSize={"40px"} fontWeight={500} lineHeight={"1"}>
                {project?.title}
              </Text>

              <Box mt={"16px"}>
                <Text fontSize={"12px"} fontWeight={600}>
                  DESCRIPTION
                </Text>
                <Text mt={"8px"} lineHeight={"24px"}>
                  {project?.description}
                </Text>
              </Box>
            </Box>
          </Flex>

          {/* flexWrap={{ base: "wrap", md: "nowrap" }} */}
          <VStack gap={"24px"} mt={"24px"}>
            <Grid
              width={"100%"}
              templateColumns={{ base: "1fr", md: "1fr 1.5fr" }}
              gap={"24px"}
            >
              <GridItem
                p={"24px"}
                borderRadius={"8px"}
                boxShadow="xs"
                border={"1px solid rgba(18, 53, 90, 0.02)"}
                backgroundImage={`url(${Pattern})`}
              >
                <Text color={"secondary"} fontWeight={600} fontSize={"12px"}>
                  BUILDER
                </Text>

                <Flex mt={"8px"} gap={"9px"}>
                  <Image
                    borderRadius={"50%"}
                    height={"40px"}
                    width={"40px"}
                    src="http://unsplash.it/200/200?random&gravity=center"
                  ></Image>

                  <Box>
                    <Text
                      fontSize={{ base: "1rem", md: "1.25rem" }}
                      lineHeight={"1.5"}
                    >
                      {bidDetail?.builderName}
                    </Text>
                    <Flex alignItems={"center"} gap={"5px"} fontSize={"12px"}>
                      <FaEnvelope color={addTransparency("#12355A", 0.8)} />{" "}
                      <Text>{bidDetail?.bid?.Owner?.email}</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      gap={"5px"}
                      mt={"6px"}
                      fontSize={"12px"}
                    >
                      <FaPhoneAlt color={addTransparency("#12355A", 0.8)} />{" "}
                      <Text>{bidDetail?.bid?.Owner?.phoneNumber}</Text>
                    </Flex>
                  </Box>
                </Flex>
              </GridItem>
              <GridItem
                p={"24px"}
                borderRadius={"8px"}
                boxShadow="xs"
                border={"1px solid rgba(18, 53, 90, 0.02)"}
                backgroundImage={`url(${Pattern})`}
                fontSize={{ base: "16px", md: "20px" }}
              >
                <Text
                  color={"secondary"}
                  fontWeight={600}
                  fontSize={"12px"}
                  textTransform={"uppercase"}
                >
                  Project Location
                </Text>

                <Flex
                  mt={"36px"}
                  alignItems={"center"}
                  fontSize={{ base: "1rem", md: "1.25rem" }}
                  gap={"0.5rem"}
                >
                  <Box
                    height={"2.5rem"}
                    width={"2.5rem"}
                    borderRadius={"50%"}
                    backgroundColor={"rgba(18, 53, 90, 0.16)"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexShrink={"0"}
                  >
                    <TiLocation color="#12355A" size={"24px"} />
                  </Box>
                  <Text as="span">{project?.location}</Text>
                </Flex>
              </GridItem>
            </Grid>

            <Grid
              width={"100%"}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap={"24px"}
            >
              <GridItem
                p={"24px"}
                borderRadius={"8px"}
                boxShadow="xs"
                border={"1px solid rgba(18, 53, 90, 0.02)"}
                backgroundImage={`url(${Pattern})`}
                fontSize={{ base: "16px", md: "20px" }}
              >
                <Text
                  color={"secondary"}
                  fontWeight={600}
                  fontSize={"12px"}
                  textTransform={"uppercase"}
                >
                  TYPE
                </Text>

                <Flex
                  mt={"36px"}
                  alignItems={"center"}
                  fontSize={"1.25rem"}
                  gap={"0.5rem"}
                >
                  <Box
                    height={"2.5rem"}
                    width={"2.5rem"}
                    borderRadius={"50%"}
                    backgroundColor={"rgba(18, 53, 90, 0.16)"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexShrink={"0"}
                  >
                    <FaCheckCircle color="#12355A" size={"24px"} />
                  </Box>
                  <Text as="span">{capitalize(project?.ProjectType)}</Text>
                </Flex>
              </GridItem>

              <GridItem
                p={"24px"}
                borderRadius={"8px"}
                boxShadow="xs"
                border={"1px solid rgba(18, 53, 90, 0.02)"}
                backgroundImage={`url(${Pattern})`}
                fontSize={{ base: "16px", md: "20px" }}
              >
                <Text
                  color={"secondary"}
                  fontWeight={600}
                  fontSize={"12px"}
                  textTransform={"uppercase"}
                >
                  STATUS
                </Text>

                <Flex
                  mt={"36px"}
                  alignItems={"center"}
                  fontSize={"1.25rem"}
                  gap={"0.5rem"}
                >
                  <Text as="span">{capitalize(bidDetail?.status)}</Text>
                </Flex>
              </GridItem>

              <GridItem
                p={"24px"}
                borderRadius={"8px"}
                boxShadow="xs"
                border={"1px solid rgba(18, 53, 90, 0.02)"}
                backgroundImage={`url(${Pattern})`}
                fontSize={{ base: "16px", md: "20px" }}
              >
                <Text
                  color={"secondary"}
                  fontWeight={600}
                  fontSize={"12px"}
                  textTransform={"uppercase"}
                >
                  START DATE
                </Text>

                <Flex
                  mt={"36px"}
                  alignItems={"center"}
                  fontSize={"1.25rem"}
                  gap={"0.5rem"}
                >
                  <Box
                    height={"2.5rem"}
                    width={"2.5rem"}
                    borderRadius={"50%"}
                    backgroundColor={"rgba(18, 53, 90, 0.16)"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexShrink={"0"}
                  >
                    <FaCalendarAlt color="#12355A" size={"24px"} />
                  </Box>
                  <Text as="span">
                    {moment(project?.startDate).format("DD-MM-YYYY")}
                  </Text>
                </Flex>
              </GridItem>
            </Grid>
          </VStack>

          <Box mt={"40px"}>
            <Text color={"secondary"} fontWeight={600}>
              Project Tenders
            </Text>

            <Flex
              mt={"24px"}
              justifyContent={"space-between"}
              gap={"24px"}
              flexWrap={"wrap"}
            >
              {bidDetail?.bid?.documents.map((file, idx) => {
                const { title, url } = file;
                return <FilePreview key={idx} title={title} url={url} />;
              })}
            </Flex>
          </Box>
          <Flex gap="40px" w="fit-content" ml="auto" mt="40px">
            <Button
              border="1px solid #12355A"
              color="primary"
              width="160px"
              background="white"
              rounded="4px"
            >
              Contact
            </Button>
            <Button
              color="#fff"
              width="160px"
              background="#F5852C"
              rounded="4px"
              isLoading={isLoading}
              onClick={acceptBid}
            >
              Accept
            </Button>
          </Flex>
        </Box>
      )}
    </BaseModal>
  );
};

export default ProjectBidModal;
