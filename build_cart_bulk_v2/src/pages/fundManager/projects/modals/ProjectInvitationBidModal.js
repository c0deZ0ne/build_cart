import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useState } from "react";
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
import {
  addTransparency,
  getFileExtension,
  handleError,
  handleSuccess,
} from "../../../../utility/helpers";
import Button from "../../../../components/Button";
import BaseModal from "../../../../components/Modals/Modal";
import instance from "../../../../utility/webservices";
import Badge from "../../../../components/Badge/Badge";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import useModalHandler from "../../../../components/Modals/SuccessModal";

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
    if (extension === "jpg" || extension === "png" || extension === "svg") {
      extension = "img";
    }
    switch (extension) {
      case "img":
        icon = url;
        color = "#FFBD00";
        break;
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
          console.error("Failed to fetch image:", response?.statusText);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [url]);

  return (
    <Box flexGrow={"1"} flexShrink={0}>
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
          <Image src={icon} height={"80px"} width={"100px"} />
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
const ProjectInvitationBidModal = ({
  bidId,
  closeModal,
  isOpen,
  getProjectDetails,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [dataNeeded, setDataNeeded] = useState(true);
  const history = useHistory();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const handleAcceptBuilderProjectBid = async (bidid) => {
    setLoadingBtn(true);
    try {
      await instance.patch(`/fundManager/project/bids/${bidid}/accept`);

      handleSuccessModal("Project has been awarded");
      handleSuccess("Project has been awarded");
      setTimeout(() => {
        setLoadingBtn(false);
        closeModal();
      }, 4000);
    } catch (error) {
      handleError(error);
      setLoadingBtn(false);
    }
    getProjectDetails();
  };

  const getTenderBidDetails = async (bidid) => {
    setLoading(true);
    try {
      if (!bidid) return;

      const { data } = (
        await instance.get(`fundManager/project/tender/${bidid}/details`)
      ).data;

      setLoading(false);

      setDataNeeded({
        builder: data?.Owner,
        projectName: data?.project?.title,
        location: data?.Owner?.businessAddress,
        description: data?.project?.description,
        projectType: data?.projectTender?.tenderType,
        status: data?.status,
        startDate: data?.project?.startDate.split("T")[0],
        tenders: data?.documents,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenderBidDetails(bidId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <BaseModal
      onClose={closeModal}
      isOpen={isOpen}
      title="Invite Vendor"
      subtitle="The copy here would explain what the supplier would be doing"
      showHeader={false}
      size="4xl"
    >
      {isLoading ? (
        <Box w="fit-content" mx="auto">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#12355A"
            size="xl"
          />
        </Box>
      ) : (
        dataNeeded && (
          <>
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
                <Box
                  width="212px"
                  height="233px"
                  background={"rebeccapurple"}
                  flexShrink={0}
                  borderRadius={"8px"}
                  overflow={"hidden"}
                >
                  <Image
                    src="http://unsplash.it/200/200?random&gravity=center"
                    height={"100%"}
                    width={"100%"}
                  />
                </Box>
                <Box>
                  <Text
                    as="h2"
                    fontSize={"40px"}
                    fontWeight={500}
                    lineHeight={"1"}
                  >
                    {/* {bidData.projectName} */}
                    {/* {dataNeeded} */}
                    {dataNeeded?.projectName}
                  </Text>

                  <Box mt={"16px"}>
                    <Text fontSize={"12px"} fontWeight={600}>
                      DESCRIPTION
                    </Text>
                    <Text mt={"8px"} lineHeight={"24px"}>
                      {dataNeeded?.description}
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
                    <Text
                      color={"secondary"}
                      fontWeight={600}
                      fontSize={"12px"}
                    >
                      BUILDER
                    </Text>

                    <Flex mt={"8px"} gap={"9px"}>
                      <Avatar
                        size="md"
                        src={dataNeeded?.builder?.logo}
                        name={dataNeeded?.builder?.businessName}
                      />

                      <Box>
                        <Text
                          fontSize={{ base: "1rem", md: "1.25rem" }}
                          lineHeight={"1.5"}
                        >
                          {dataNeeded?.builder?.businessName}
                        </Text>
                        <Flex
                          alignItems={"center"}
                          gap={"5px"}
                          fontSize={"12px"}
                        >
                          <FaEnvelope color={addTransparency("#12355A", 0.8)} />{" "}
                          <Text>{dataNeeded?.builder?.email}</Text>
                        </Flex>
                        <Flex
                          alignItems={"center"}
                          gap={"5px"}
                          mt={"6px"}
                          fontSize={"12px"}
                        >
                          <FaPhoneAlt color={addTransparency("#12355A", 0.8)} />{" "}
                          <Text>{dataNeeded?.builder?.phoneNumber}</Text>
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
                      <Text as="span">{dataNeeded?.location}</Text>
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
                      <Text as="span">
                        {capitalize(dataNeeded?.projectType)}
                      </Text>
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
                      <Text as="span">{dataNeeded?.startDate}</Text>
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

                    <Flex mt={"36px"}>
                      <Badge status={dataNeeded?.status} />
                    </Flex>
                  </GridItem>
                </Grid>
              </VStack>

              <Box mt={"40px"}>
                <Text color={"secondary"} fontWeight={600}>
                  Project Tenders
                </Text>

                <SimpleGrid columns={[1, 2, 3]} gap={8}>
                  {dataNeeded?.tenders?.map((file, idx) => {
                    const { title, url } = file;
                    return <FilePreview key={idx} title={title} url={url} />;
                  })}
                </SimpleGrid>
              </Box>
            </Box>

            <Flex justify="flex-end" gap={10} m="40px 20px 0">
              <Button variant onClick={() => history.push("/support")}>
                Contact
              </Button>
              <Button
                isLoading={isLoadingBtn}
                onClick={() => handleAcceptBuilderProjectBid(bidId)}
              >
                Accept
              </Button>
            </Flex>
          </>
        )
      )}

      {ModalComponent}
    </BaseModal>
  );
};

export default ProjectInvitationBidModal;
