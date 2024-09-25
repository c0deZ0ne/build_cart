import {
  Box,
  Button as ChakraButton,
  Flex,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPlus, FaTimes } from "react-icons/fa";
import * as yup from "yup";
import Button from "../../../components/Button";
import Input, { TextArea } from "../../../components/Input";
import DragAndDropBox from "./components/DragAndDropBox";
import { uploadImage } from "../../../utility/queries";
import {
  useAddBuilderPortfolioMutation,
  useEditBuilderPortfolioMutation,
  useGetBuilderPortfolioQuery,
} from "../../../redux/api/builder/builder";

const BusinessPortfolioView = () => {
  const toast = useToast();
  const [
    addFn,
    {
      isLoading: isAdding,
      isError: addFailed,
      error: addError,
      isSuccess: addSuccess,
    },
  ] = useAddBuilderPortfolioMutation();

  const [
    editFn,
    {
      isLoading: isEdittingPortfolio,
      isError: editFailed,
      error: editError,
      isSuccess: editSuccess,
    },
  ] = useEditBuilderPortfolioMutation();

  const {
    data: portFolioResponse,
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio,
  } = useGetBuilderPortfolioQuery();

  const portfolioData = useMemo(() => {
    if (!portFolioResponse || !portFolioResponse.data) {
      return null;
    }

    const { id, title, description, Medias } = portFolioResponse.data;
    return { id, title, description, media: Medias.map((m) => m.url) };
  }, [portFolioResponse]);

  const formSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  });

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = methods;

  const [mediaData, setMediaData] = useState([]);

  const handleFileDrop = useCallback((item, index) => {
    if (item) {
      /**
       * @type {File[]}
       */
      const file = item.files[0];

      setMediaData((prevState) => {
        const copy = [...prevState];

        copy[index] = { file: file, title: "" };

        return copy;
      });

      /**
       * @type {DocData[]}
       */
    }
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  function imageBlobUrl(file) {
    return URL.createObjectURL(file);
  }

  function removeImage(index) {
    setMediaData((prevState) => {
      const copy = [...prevState];

      copy[index] = undefined;

      return copy;
    });
  }

  function handleInput(e, index) {
    const { value } = e.target;

    setMediaData((prevState) => {
      const copy = [...prevState];

      copy[index].title = value;

      return copy;
    });
  }

  useEffect(() => {
    if (addSuccess) {
      toast({
        status: "success",
        description: "Portfolio added",
      });

      refetchPortfolio();
      reset();
      setShowForm(false);
      setMediaData([]);
    }

    if (addFailed && addError) {
      toast({ status: "error", description: addError.data.message });
    }
  }, [addError, addFailed, addSuccess]);

  const [showForm, setShowForm] = useState(false);
  const [isEditting, setIsEditting] = useState(false);

  function convertImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      // Fetch the content from the URL
      fetch(url).then(async (response) => {
        const contentType = response.headers.get("content-type");
        const blob = await response.blob();
        const file = new File([blob], "file", { contentType });
        // access file here
        resolve(file);
      });
    });
  }

  async function setEditData() {
    setIsEditting(true);

    setValue("title", portfolioData?.title);
    setValue("description", portfolioData.description);

    if (!portfolioData.media) return;

    portfolioData.media.forEach((media) => {
      convertImageFromUrl(media);
    });

    for (const media of portfolioData.media) {
      const file = await convertImageFromUrl(media);

      setMediaData((curr) => {
        const copy = [...curr];

        copy.push({ file: file, title: "" });

        return copy;
      });
    }
  }

  const onSubmit = async (data) => {
    console.log(data);

    if (!isEditting) {
      try {
        setIsUploading(true);
        const files = mediaData.filter((data) => !!data);
        const uploadReqs = files.map(async (file) => {
          const { url } = await uploadImage(file.file, "image", () => {});

          return { url: url, title: file.title, mediaType: "IMAGE" };
        });

        const mediaStuff = await Promise.all([...uploadReqs]);

        const dataToSubmit = {
          title: data.title,
          description: data.description,
          portFolioMedias: mediaStuff,
        };
        addFn({ data: dataToSubmit });
      } catch (error) {
        toast({
          status: "error",
          description: error.message,
        });
      } finally {
        setIsUploading(false);
      }
    }

    if (isEditting) {
      const dataToSubmit = {
        title: data.title,
        description: data.description,
        portFolioId: portfolioData.id,
      };
      editFn({
        data: dataToSubmit,
      });
    }
  };

  useEffect(() => {
    if (addSuccess) {
      toast({
        status: "success",
        description: "Portfolio added",
      });

      refetchPortfolio();
      reset();
      setShowForm(false);
      setMediaData([]);
    }

    if (addFailed && addError) {
      toast({ status: "error", description: addError.data.message });
    }
  }, [addError, addFailed, addSuccess]);

  useEffect(() => {
    if (editSuccess) {
      toast({
        status: "success",
        description: "Portfolio editted!",
      });

      refetchPortfolio();
      reset();
      setIsEditting(false);
      setShowForm(false);
      setMediaData([]);
    }

    if (editFailed && editError) {
      toast({ status: "error", description: editError.data.message });
    }
  }, [editError, editFailed, editSuccess]);

  return (
    <Box w={{ sm: "100%" }} p="24px">
      <Box>
        <Text fontWeight="600" color="secondary">
          Business Portfolio{" "}
        </Text>
        <Text fontSize="12px" color="primary">
          You can update and edit your portfolio information here.{" "}
        </Text>
      </Box>

      {portfolioData && !isEditting && (
        <Box>
          <Flex justifyContent={"flex-end"} my={"1rem"}>
            <Box width={"100%"} maxWidth={"400px"}>
              <Button
                full
                onClick={() => {
                  setShowForm(true);
                  setEditData();
                }}
                color={"#F5852C"}
                gap={"1rem"}
                variant={"primary"}
              >
                Edit
              </Button>
            </Box>
          </Flex>

          <Box>
            <Text fontSize={"24px"} fontWeight={600} color={"#666666"}>
              {portfolioData.title}
            </Text>
            <Text mt={"24px"} fontSize={"12px"}>
              {portfolioData.description}
            </Text>
          </Box>

          <Box mt={"25px"}>
            <Flex gap={"32px"} wrap={"wrap"}>
              {portfolioData.media.map((url, index) => {
                return (
                  <Image
                    key={index + url}
                    borderRadius={"8px"}
                    w={"100%"}
                    maxWidth={"320px"}
                    h={"160px"}
                    src={url}
                  />
                );
              })}
            </Flex>
          </Box>
        </Box>
      )}

      {showForm && (
        <Box mt={"60px"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={"24px"}>
              <Box w={"100%"}>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Title{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="title"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Input
                        type={"text"}
                        value={value}
                        onChange={onChange}
                        placeholder="Portfolio title"
                      />
                      <div style={{ color: "red" }}>
                        {errors["title"] ? errors["title"]?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              <Box w={"100%"}>
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Portfolio Description{" "}
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="description"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <TextArea
                        type={"text"}
                        value={value}
                        onChange={onChange}
                        placeholder="Add a description about your portfolio."
                      />
                      <div style={{ color: "red" }}>
                        {errors["description"]
                          ? errors["description"]?.message
                          : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              {!isEditting && (
                <SimpleGrid
                  gridTemplateColumns={{
                    base: "1fr",
                    md: "1fr 1fr",
                    xl: "1fr 1fr 1fr 1fr",
                  }}
                  gap={"32px"}
                >
                  {Array.from({ length: 4 }).map((a, idx) => {
                    return (
                      <Box key={idx} width={"100%"}>
                        {!mediaData[idx]?.file && (
                          <DragAndDropBox
                            onDrop={(item) => handleFileDrop(item, idx)}
                          />
                        )}

                        {mediaData[idx]?.file && (
                          <Box position={"relative"}>
                            <Image
                              border={"1px solid grey"}
                              borderRadius={"8px"}
                              objectPosition={"center"}
                              width={"100%"}
                              height={"240px"}
                              src={imageBlobUrl(mediaData[idx].file)}
                              alt="file"
                            />

                            <Box mt={"4px"}>
                              <Text color={"#333"} fontSize={"14px"}>
                                Title:
                              </Text>
                              <Input onChange={(e) => handleInput(e, idx)} />
                            </Box>

                            <ChakraButton
                              onClick={() => removeImage(idx)}
                              size={"xs"}
                              height={"32px"}
                              width={"32px"}
                              backgroundColor={"primary"}
                              color={"white"}
                              borderRadius={"50%"}
                              position={"absolute"}
                              top={"-16px"}
                              right={"-16px"}
                            >
                              <FaTimes />
                            </ChakraButton>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
            </VStack>

            <Flex mt={"120px"} width={"100%"} maxWidth={"600px"} gap={"16px"}>
              <Box flexGrow={"1"}>
                <Button
                  isSubmit
                  full
                  isLoading={isAdding || isUploading || isEdittingPortfolio}
                >
                  Save
                </Button>
              </Box>

              {isEditting && (
                <Box flexGrow={"1"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setIsEditting(false);
                      setShowForm(false);
                    }}
                    full
                    isLoading={isAdding || isUploading || isEdittingPortfolio}
                  >
                    Cancel Edit
                  </Button>
                </Box>
              )}
            </Flex>
          </form>
        </Box>
      )}

      {!showForm && !portfolioData && (
        <ChakraButton
          onClick={() => setShowForm(true)}
          mt={"64px"}
          color={"#F5852C"}
          gap={"1rem"}
          variant={"ghost"}
          isLoading={isLoadingPortfolio}
        >
          <FaPlus /> Add Project Portfolio
        </ChakraButton>
      )}
    </Box>
  );
};

export default BusinessPortfolioView;
