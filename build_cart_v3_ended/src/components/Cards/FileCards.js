import { Box, Flex, Image, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { Button2 } from "../Button";
import ExcelIcon from "../../assets/images/excel.svg";
import PdfIcon from "../../assets/images/pdf2.svg";
import PowerPointIcon from "../../assets/images/powerpoint2.svg";
import WordIcon from "../../assets/images/word.svg";
import ImageIcon from "../../assets/images/image.svg";
import TruncateText from "../Truncate";
import instance from "../../utility/webservices";
import { useParams } from "react-router-dom";
import { handleSuccess } from "../../utility/helpers";
import ConfirmationModal from "../Modals/ConfirmationModal";

const FileCards = ({ file, owner, getProjectDetails }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setLoading] = useState(false);
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const files = {
    excel: { url: ExcelIcon, bg: "#21A36629" },
    csv: { url: ExcelIcon, bg: "#21A36629" },
    pdf: { url: PdfIcon, bg: "#D3392229" },
    ppt: { url: PowerPointIcon, bg: "#D3392229" },
    word: { url: WordIcon, bg: "#1C60C029" },
    img: { url: ImageIcon, bg: "#FFBD0029" },
    png: { url: ImageIcon, bg: "#FFBD0029" },
    jpg: { url: ImageIcon, bg: "#FFBD0029" },
    jpeg: { url: ImageIcon, bg: "#FFBD0029" },
    image: { url: ImageIcon, bg: "#FFBD0029" },
    svg: { url: ImageIcon, bg: "#FFBD0029" },
  };

  function initiateDownload(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = url;
    link.target = "_blank";
    link.click();
  }

  const handleDeleteMedia = async () => {
    setLoading(true);
    const payload = {
      projectMediaId: file?.id,
      projectDocumentId: file?.id,
      projectId,
    };

    try {
      await instance.delete(
        user?.userType === "BUILDER"
          ? `/builder/project/${projectId}/delete-media`
          : `/fundManager/project/${projectId}/delete-media`,
        {
          params: payload,
          data: payload,
        }
      );

      handleSuccess("Delete successful");
      setLoading(false);
      onClose();
      getProjectDetails(2);
    } catch (error) {
      getProjectDetails(2);
      setLoading(false);
      handleSuccess("File has been deleted");
    }
  };

  return (
    <div>
      <Box mb="10px" flexGrow={"1"} flexShrink={0}>
        <Box
          borderRadius={"8px"}
          overflow={"hidden"}
          boxShadow={"0px 0px 8px 1px rgba(18, 53, 90, 0.04)"}
        >
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            bg={files[file?.type]?.bg}
            py={"30px"}
            onClick={() => initiateDownload(file?.src)}
            cursor="pointer"
          >
            <Image
              src={
                files[file?.type]?.bg === "#FFBD0029"
                  ? file?.src ?? files[file?.type]?.url
                  : files[file?.type]?.url
              }
              height={"80px"}
              width={"100px"}
              alt={`${file?.name} - ${file?.type}`}
            />
          </Flex>
          <Box py={"8px"} px={"16px"} overflow={"hidden"}>
            <Flex
              wrap="wrap"
              color={"#666666"}
              fontSize={"13px"}
              fontWeight={600}
              onClick={() => initiateDownload(file?.src)}
              cursor="pointer"
            >
              <TruncateText popover innerWidth="90%" outerWidth="100%">
                {file?.name}
              </TruncateText>
            </Flex>
            <Text fontSize={"12px"}>{file?.fileType}</Text>
            <Text fontSize={"12px"}>45kb</Text>
          </Box>
        </Box>

        <Box textAlign={"center"} mt={"16px"}>
          {owner && (
            <Button2 padding="20px" onClick={onOpen} color="#C43C25">
              Delete
            </Button2>
          )}
        </Box>
      </Box>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleAction={handleDeleteMedia}
        message={"Are you sure you want to delete this file permanently?"}
        title={"Delete media file"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FileCards;
