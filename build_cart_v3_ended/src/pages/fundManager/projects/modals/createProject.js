import React, { forwardRef, useEffect, useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEnvelope, FaPlus, FaUser } from "react-icons/fa6";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../../../redux/api/fundManager/projectSlice";
import {
  Box,
  FormLabel,
  HStack,
  Button as ChakraButton,
  Text,
  Flex,
  CircularProgress,
  Image,
  Progress,
} from "@chakra-ui/react";
import Input, { InputPhone, TextArea } from "../../../../components/Input";
import SuccessMessage from "../../../../components/SuccessMessage";
import SelectSearch from "../../../../components/SelectSearch";
import Button from "../../../../components/Button";
import { handleError, handleSuccess } from "../../../../utility/helpers";
import {
  fetchStates,
  imageHandler,
  uploadImage,
} from "../../../../utility/queries";
import Upload from "../../../../components/Icons/Upload";
import { IoIosCloseCircle } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../../../components/Icons/Calendar";
import instance from "../../../../utility/webservices";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import DeleteIcon from "../../../../components/Icons/Delete";
import ImagePlaceholder from "../../../../assets/images/imgplaceholder.svg";
import { MdCancel } from "react-icons/md";
import CutSelect from "../../../../components/CustomSelect/CutSelect";

export default function CreateProject({
  refetch,
  isOpen,
  onClose,
  project = null,
}) {
  const [isCloseSearch, setCloseSearch] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [builderInvite, setBuilderInvite] = useState(false);
  const [builderInviteData, setBuilderInviteData] = useState({});
  const [projectGroup, setProjectGroup] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoadingPG, setLoadingPG] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [showSelectBuilder, setShowSelectBuilder] = useState(false);
  const [openBuilderInvite, setOpenBuilderInvite] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePlaceholder, setImagePlaceholder] = useState("Upload 3D image");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [randomImgKey, setRandomImgKey] = useState(Math.random());
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [documents, setDocuments] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [documentError, setDocumentError] = useState(false);
  const [docProgress, setDocProgress] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);

  const documentOptions = [
    "Certificate of Incorporation",
    "Insurance Certificate",
    "Confirmation of Address",
    "Proof of Identity",
    "Bank Statement",
    "Projects Portfolio",
    "Plant/Equipment Inventory",
    "Others",
  ];

  const imageUploader = async (e) => {
    if (e.target.files[0] === null) return false;
    setImage(e.target.files[0]);
    setImagePlaceholder(e.target.files[0].name);
  };

  const getMyBuilders = async () => {
    //Todo: To fix the pagination issue
    const { data } = (
      await instance.get("/fundManager/my/builders?page_size=5000")
    ).data;

    const arr = data?.builders?.map((e) => ({
      ...e,
      name: e?.name ?? "Builder Name",
      id: e?.BuilderId,
    }));

    setBuilders(arr);
  };

  const getStates = async () => {
    const statesData = await fetchStates();

    const stateArr = statesData.states.map((e, i) => ({
      value: e.name,
      label: e.name,
    }));
    setStates(stateArr);
  };

  useEffect(() => {
    getMyBuilders();
    getStates();
  }, [project]);

  const createProjectSchema = yup.object({
    projectTile: yup.string().required("Project title is required"),
    startDate: yup.string().required("Project start date is required"),
    endDate: yup.string().required("Project end date is required"),
    projectLocation: yup.object().required("Project location is required"),
    projectgroup: yup.object().required("Project group is required"),
  });

  const inviteBuilderSchema = yup.object({
    name: yup.string().required("Builder name is required"),
    email: yup.string().required("Builder email is required").email(),
    phoneNumber: yup.string().required("Builder phone number is required"),
  });

  const groupSchema = yup.object({
    groupname: yup.string().required("Project group name is required"),
  });

  const methods = useForm({
    defaultValues: {
      projectTile: "",
      startDate: "",
      endDate: "",
    },
    resolver: yupResolver(createProjectSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = methods;

  const {
    control: inviteControl,
    handleSubmit: handleInviteSubmit,
    formState: { errors: inviteErrors },
    reset: resetInvite,
  } = useForm({
    defaultValues: {
      email: "",
      message: "",
    },
    resolver: yupResolver(inviteBuilderSchema),
  });

  const {
    control: groupControl,
    handleSubmit: handleGroupSubmit,
    formState: { errors: groupErrors },
    reset: resetGroup,
  } = useForm({
    resolver: yupResolver(groupSchema),
  });

  const submitInvite = async (data) => {
    const payload = {
      toName: data?.name,
      toEmail: data?.email,
      inviteeName: userInfo?.userName,
      phoneNumber: data?.phoneNumber,
    };

    setBuilderInvite(true);
    setBuilderInviteData(payload);
    setOpenBuilderInvite(false);
    setCloseSearch(!isCloseSearch);
    setValue("builder", { name: data?.email });
    clearErrors("builder");
  };

  const getGroup = async () => {
    try {
      const { data } = (await instance.get("/project-group?page_size=100"))
        .data;

      const grp = data.map((e) => ({
        ...e,
        name: e?.name ?? "Builder Name",
        id: e?.id,
      }));
      setProjectGroup(grp);
    } catch (error) {
      handleError(error);
    }
  };

  const submitGroup = async ({ groupname, message }) => {
    setLoadingPG(true);
    const payload = {
      description: message,
      name: groupname,
    };

    try {
      await instance.post("/project-group/create", payload);
      handleSuccess("Project group has been created.");
      setLoadingPG(false);
      await getGroup();
      setOpenGroup(false);
    } catch (error) {
      setLoadingPG(false);
      handleError(error);
    }
  };

  useEffect(() => {
    if (!openBuilderInvite) {
      resetInvite();
      setOpenBuilderInvite(false);
    }

    if (!openGroup) {
      resetGroup();
      setOpenGroup(false);
    }
  }, [openBuilderInvite, resetInvite, openGroup, resetGroup]);

  useEffect(() => {
    if (project?.id && states.length > 0) {
      const grp = project?.Groups[0];
      const builder = project?.developers[0];
      const pic = project?.Medias[0];
      const picName = pic?.url?.split("/").pop();

      const stateCopy = [...states];
      const projstate = stateCopy.find((e) => e?.value === project?.location);

      setValue("projectTile", project.title);
      setValue("startDate", new Date(project.startDate));
      setValue("endDate", new Date(project.endDate));
      setValue("projectLocation", projstate);
      setValue("description", project.description);
      setValue("projectgroup", {
        name: grp?.name,
        id: grp?.id,
        value: grp?.id,
      });
      setValue("builder", {
        name: builder?.owner?.name ?? builder?.businessName,
        id: builder?.id,
        value: builder?.id,
      });
      setImageName(pic?.title);
      setImagePlaceholder(picName);
      setShowSelectBuilder(true);
      setEditImageUrl(pic?.url);
    }
    getGroup();
  }, [project, setValue, states]);

  const [
    createProject,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      error: createError,
      isError: createIsError,
    },
  ] = useCreateProjectMutation();

  const [
    updateProject,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      error: updateError,
      isError: updateIsError,
    },
  ] = useUpdateProjectMutation();

  const onUploadProgress = (prog) => {
    setUploadProgress(prog);
  };

  const submitProject = async (data) => {
    let img;

    let err = [];
    for (let i = 0; i < documents.length; i++) {
      if (!documents[i]?.documentFilename) {
        err.push(true);
      } else {
        err.push(false);
      }
    }

    const docs = documents.map((e) => {
      setDocumentError(false);

      return {
        ...e,
        title: e?.documentFilename ?? "Project document",
        mediaType: "FILE",
        description: `This is a ${e?.documentFilename} document for project titled ${data.projectTile}`,
      };
    });

    if (err.includes(true)) {
      console.log("err");
      setDocumentError(true);
      return handleError("Kindly select document name for all documents!");
    }

    if (!docs) {
      return false;
    }

    if (image) {
      setLoading(true);
      img = await uploadImage(image, "image", onUploadProgress);
    }

    setLoading(false);

    if (project?.id) {
      updateProject({
        payload: {
          description: data.description,
          location: data?.projectLocation?.label,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          title: data.projectTile,
          projectMedia: img
            ? [
                {
                  url: img.url ?? editImageUrl,
                  title: imageName ? imageName : imagePlaceholder,
                  mediaType: "IMAGE",
                  description: `This is a 3D image of project image titled ${data.projectTile}`,
                },
              ]
            : [],
          newDevelopers: builderInvite
            ? [builderInviteData?.toEmail]
            : data?.builder?.id
            ? [data?.builder?.id]
            : [],
          groupIds: [data?.projectgroup?.id],
          id: project?.id,
          projectId: project?.id,
          projectDocuments: docs,
        },
        id: project?.id,
        projectId: project?.id,
      });
    } else {
      createProject({
        location: data?.projectLocation?.label,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        title: data.projectTile,
        description: data.description,
        newDevelopers: builderInvite
          ? [builderInviteData?.toEmail]
          : data?.builder
          ? [data?.builder?.BuilderId]
          : [],
        groupIds: [data?.projectgroup?.id],
        projectMedia: img
          ? [
              {
                url: img.url,
                title: imageName ? imageName : imagePlaceholder,
                mediaType: "IMAGE",
                description: `This is a 3D image of project image - ${data.projectTile}`,
              },
            ]
          : [],
        projectDocuments: docs,
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      setProjectSuccess(true);

      refetch && refetch();
    }
    if (createIsError || updateIsError) {
      handleError(createError || updateError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading, updateLoading]);

  useEffect(() => {
    if (!isOpen && project == null) {
      reset();
      setShowSelectBuilder(false);
    }
  }, [isOpen, reset, project]);

  const StartDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="Start date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));

  const EndDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="End date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    setUploading(true);
    const originalDocs = [...documents];
    const docs = [...documents];
    const files = e?.dataTransfer?.files
      ? e?.dataTransfer?.files
      : e?.target?.files;

    for (let i = 0; i < files.length; i++) {
      docs.push({
        name: files[i]?.name,
        file: files[i],
        url: "",
        publicId: "",
      });
    }

    setDocuments(docs);

    const uploadfile = await imageHandler(files, handleUploadProgress);

    for (let i = 0; i < uploadfile.length; i++) {
      docs[originalDocs?.length + i].url = uploadfile[i]?.url;
      docs[originalDocs?.length + i].publicId = uploadfile[i]?.publicId;
    }

    setUploading(false);
    setDocuments(docs);
  };

  let arr = [...docProgress];
  const handleUploadProgress = (progress, fileLength) => {
    let ar = [...arr, progress];
    ar[fileLength] = progress;

    if (progress === 100) {
      arr.push(progress);
    }

    setDocProgress(ar);
  };

  const handleDeleteDocument = (id) => {
    const docs = [...documents];

    const filteredDocs = docs.filter((e, i) => i !== id);
    const filteredProgress = docProgress.filter((e, i) => i !== id);

    setDocuments(filteredDocs);
    setDocProgress(filteredProgress);
  };

  const handleChooseDocument = (event, index) => {
    const docs = [...documents];
    docs[index].documentFilename = event;

    setDocuments(docs);
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setProjectSuccess(false);
          setImagePlaceholder("Upload 3D image");
          setImage(null);
          setBuilderInvite(false);
        }}
        title={`${project == null ? "Create" : "Update"} Project`}
        subtitle={
          project == null
            ? `Create a new project`
            : 'Edit the project details and click the "Update button to save"'
        }
        showHeader={projectSuccess ? false : true}
      >
        {projectSuccess ? (
          <SuccessMessage
            message={`Project ${
              project == null ? "Created" : "Updated"
            } Successfully`}
          />
        ) : (
          <Box fontSize="14px">
            <Box mb={"18px"}>
              <Box>
                <Text fontSize="15px">
                  Group Name{" "}
                  <Text as="span" color="red">
                    *
                  </Text>{" "}
                </Text>
                <Text>Categorize your projects by adding them to a group</Text>
              </Box>

              <Controller
                control={control}
                name="projectgroup"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <SelectSearch
                      placeholder="Select Group"
                      data={projectGroup}
                      setSelectOption={onChange}
                      selectOption={value}
                      showInvite={true}
                      inviteText="Add Group"
                      setOpenInvite={setOpenGroup}
                      position="down"
                    />
                    <div style={{ color: "red" }}>
                      {errors["projectgroup"] &&
                        errors["projectgroup"]?.message}
                    </div>
                  </Box>
                )}
              />
            </Box>
            <Box my={5}>
              <hr />
            </Box>
            <Box mb={"18px"}>
              <Controller
                control={control}
                defaultValue=""
                name="projectTile"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="Add Project Title"
                      label="Project Title"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {errors["projectTile"]
                        ? errors["projectTile"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
            <Box mb={"18px"}>
              <Controller
                control={control}
                defaultValue=""
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <TextArea
                      label="Project Description"
                      placeholder="Add Project Description..."
                      value={value}
                      onChange={onChange}
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
            <Box mb="18px">
              <Text mb="8px" fontSize="14px" fontWeight="400">
                Project 3D Image (optional)
              </Text>
              <HStack
                justifyContent="space-between"
                spacing="16px"
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                <Flex
                  align="center"
                  bgColor="rgba(18, 53, 90, 0.04)"
                  h="48px"
                  borderRadius="8px"
                  border="0.5px solid #999"
                  w={{ base: "100%", md: "65%" }}
                >
                  <Flex
                    as="label"
                    p="8px 16px"
                    htmlFor="uploadImage"
                    align="center"
                    cursor="pointer"
                    w={"100%"}
                  >
                    <Upload />
                    <Flex
                      ml="8px"
                      w="100%"
                      justify="space-between"
                      fontSize="12px"
                    >
                      {imagePlaceholder}{" "}
                      <CircularProgress
                        value={uploadProgress}
                        size="20px"
                        color="primary"
                      />
                    </Flex>
                    <input
                      key={randomImgKey}
                      type="file"
                      id="uploadImage"
                      accept={"image/*"}
                      onChange={(e) => {
                        imageUploader(e);
                      }}
                      hidden
                    />
                  </Flex>
                  <Flex
                    align="center"
                    ml="auto"
                    pr="16px"
                    cursor="pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePlaceholder("Upload 3D image");
                      setRandomImgKey(Math.random());
                    }}
                  >
                    {imagePlaceholder !== "Upload 3D image" && (
                      <IoIosCloseCircle color="#999999" />
                    )}
                  </Flex>
                </Flex>
                <Box w={{ base: "100%", md: "35%" }}>
                  <Input
                    placeholder="Enter file name"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                  />
                </Box>
              </HStack>
            </Box>
            <Box mb="18px">
              <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                Project Duration <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <HStack
                mb={"18px"}
                justifyContent="space-between"
                spacing="16px"
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                <Box w="100%">
                  <Controller
                    control={control}
                    defaultValue=""
                    name="startDate"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <DatePicker
                          selected={value}
                          minDate={new Date()}
                          onChange={onChange}
                          customInput={<StartDate />}
                          wrapperClassName="datepicker_width"
                          showMonthDropdown
                          showYearDropdown
                        />
                        <div style={{ color: "red" }}>
                          {errors["startDate"]
                            ? errors["startDate"]?.message
                            : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
                <Box w="100%">
                  <Controller
                    control={control}
                    defaultValue=""
                    name="endDate"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"}>
                        <DatePicker
                          selected={value}
                          onChange={onChange}
                          minDate={new Date()}
                          customInput={<EndDate />}
                          wrapperClassName="datepicker_width"
                          showMonthDropdown
                          showYearDropdown
                        />
                        <div style={{ color: "red" }}>
                          {errors["endDate"] ? errors["endDate"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
              </HStack>
            </Box>
            <Box mb={"18px"}>
              <Controller
                control={control}
                name="projectLocation"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <CustomSelect
                      placeholder="Project Location"
                      label="Project Location"
                      onChange={onChange}
                      value={value}
                      options={states}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {errors["projectLocation"]
                        ? errors["projectLocation"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
            {showSelectBuilder && (
              <Box mb={"18px"}>
                <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                  Project Builder <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Controller
                  control={control}
                  defaultValue=""
                  name="builder"
                  render={({ field: { onChange, value } }) => (
                    <Box w={"100%"}>
                      <SelectSearch
                        placeholder="Select  Builder from your list or send an invite."
                        data={builders}
                        setSelectOption={(item) => {
                          onChange(item);
                          setBuilderInvite(false);
                        }}
                        selectOption={value}
                        showInvite={true}
                        inviteText="Invite Builder"
                        setOpenInvite={setOpenBuilderInvite}
                        isCloseSearch={isCloseSearch}
                      />
                    </Box>
                  )}
                />
              </Box>
            )}{" "}
            {!showSelectBuilder && (
              <ChakraButton
                variant="link"
                color="#F5852C"
                ml="auto"
                display="flex"
                onClick={() => setShowSelectBuilder(true)}
              >
                <FaPlus />
                Add Project Builder
              </ChakraButton>
            )}
            <div style={{ color: "red" }}>
              {errors["builder"] && errors["builder"]?.message}
            </div>
            <div style={{ fontWeight: "600", color: "green" }}>
              {builderInvite && "You are inviting a builder"}
            </div>
            <Box mt={5}>
              <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                Project Documents (optional)
              </FormLabel>
              <Box width="100%" mb="30px">
                {documents.length < 4 ? (
                  <label
                    onDragEnter={handleDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      display: "inline-block",
                      border: `2px dashed ${dragging ? "green" : "#F5862E"}`,
                      borderRadius: "7px",
                      background: "#fef6ee",
                      padding: "10px 5px",
                      textAlign: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      width: "100%",
                    }}
                    htmlFor="uploadfiles"
                  >
                    <Text as={"span"} color="info">
                      <Text as={"span"} color="secondary">
                        Click here
                      </Text>{" "}
                      to upload or drag and drop your files here
                    </Text>
                    <input
                      type="file"
                      name="upload"
                      multiple
                      id="uploadfiles"
                      accept={".pdf,image/*"}
                      onChange={(e) => {
                        handleDrop(e);
                      }}
                      hidden
                    />
                  </label>
                ) : (
                  <>
                    <label
                      style={{
                        display: "inline-block",
                        border: `2px dashed ${dragging ? "green" : "#999999"}`,
                        borderRadius: "7px",
                        background: "#efefef",
                        padding: "20px 5px",
                        textAlign: "center",
                        fontSize: "14px",
                        width: "100%",
                        cursor: "not-allowed",
                      }}
                      htmlFor="uploadfiles"
                    >
                      <Text as={"span"} color="info">
                        <Text as={"span"} color="secondary">
                          Click here
                        </Text>{" "}
                        to upload or drag and drop your files here
                      </Text>
                    </label>
                    <Text
                      textAlign="center"
                      color="#eb3232"
                      mt={1}
                      fontSize="14px"
                    >
                      You can't upload more documents.
                    </Text>
                  </>
                )}
                {isUploading && (
                  <Progress
                    mt="2"
                    colorScheme="orange"
                    size="xs"
                    isIndeterminate
                  />
                )}
              </Box>
              <Box>
                {documents.length > 0 &&
                  documents.slice(0, 4).map((e, i) => (
                    <Flex
                      justify="space-between"
                      gap={2}
                      my={2}
                      alignItems="center"
                      key={i}
                    >
                      <Flex
                        alignItems="center"
                        justify="space-between"
                        p="12px"
                        bg="#f2f3f6"
                        fontSize="12px"
                        gap={2}
                        width="60%"
                        rounded={"8px"}
                      >
                        <Box>
                          <Image src={ImagePlaceholder} alt="document1" />
                        </Box>
                        <Box w="200px" textOverflow="ellipsis">
                          <Text
                            w="130px"
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                          >
                            {e?.name || "Certificate of incorporation"}
                          </Text>
                        </Box>
                        <Box>
                          {docProgress[i] !== 100 && (
                            <CircularProgress
                              value={docProgress[i]}
                              size="20px"
                              color="primary"
                            />
                          )}
                        </Box>
                        <Box
                          onMouseEnter={() => setHover(i)}
                          onMouseLeave={() => setHover(-1)}
                          cursor="pointer"
                        >
                          {docProgress[i] !== 100 ? (
                            <MdCancel
                              color={hover === i ? "#eb3232" : "#999"}
                              fontSize="16px"
                              onClick={() => handleDeleteDocument(i)}
                            />
                          ) : (
                            <DeleteIcon
                              color={hover === i ? "#eb3232" : "#999"}
                              onClick={() => handleDeleteDocument(i)}
                            />
                          )}
                        </Box>
                      </Flex>
                      <Box w="40%">
                        <CutSelect
                          value={documents[i]?.documentFilename}
                          onChange={(e) => handleChooseDocument(e, i)}
                          options={documentOptions}
                        />
                      </Box>
                    </Flex>
                  ))}

                <Text color="red">
                  {documentError &&
                    "Kindly select document name for all documents."}
                </Text>
              </Box>
            </Box>
            <Box mt="41px">
              <Button
                full
                isLoading={
                  loading ? loading : project ? updateLoading : createLoading
                }
                onClick={handleSubmit(submitProject)}
              >
                {project ? "Update" : "Create"} Project
              </Button>
            </Box>
          </Box>
        )}
      </BaseModal>

      <BaseModal
        isOpen={openBuilderInvite}
        onClose={() => setOpenBuilderInvite(false)}
        title="Invite Builder"
        subtitle="Enter the details of the builder below to get them on the platform"
      >
        <Box fontSize="14px">
          <Box mb={"18px"}>
            <Controller
              control={inviteControl}
              defaultValue=""
              name="name"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="John Jameson"
                    label="Name"
                    value={value}
                    onChange={onChange}
                    isRequired
                    leftIcon={<FaUser />}
                  />
                  <div style={{ color: "red" }}>
                    {inviteErrors["name"] ? inviteErrors["name"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          <Box mb={"18px"}>
            <Controller
              control={inviteControl}
              defaultValue=""
              name="email"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="mail@mail.com"
                    label="Email Address"
                    value={value}
                    onChange={onChange}
                    isRequired
                    leftIcon={<FaEnvelope />}
                  />
                  <div style={{ color: "red" }}>
                    {inviteErrors["email"]
                      ? inviteErrors["email"]?.message
                      : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          <Box mb={"18px"}>
            <Controller
              control={inviteControl}
              defaultValue=""
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <InputPhone
                    label="Phone Number"
                    placeholder="1234567890"
                    value={value}
                    onChange={onChange}
                  />{" "}
                  <div style={{ color: "red" }}>
                    {inviteErrors["phoneNumber"] &&
                      inviteErrors["phoneNumber"]?.message}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Box mt="41px">
          <Button full onClick={handleInviteSubmit(submitInvite)}>
            Continue
          </Button>
        </Box>
      </BaseModal>

      <BaseModal
        isOpen={openGroup}
        onClose={() => setOpenGroup(false)}
        title="Add Group Manager"
        subtitle="Add a group to categorize your projects"
      >
        <Box mb={"18px"} fontSize="14px">
          <Controller
            control={groupControl}
            defaultValue=""
            name="groupname"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Group Name"
                  label="Group Name"
                  value={value}
                  onChange={onChange}
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {groupErrors["groupname"] &&
                    groupErrors["groupname"]?.message}
                </div>
              </Box>
            )}
          />
        </Box>

        <Box mb={"18px"}>
          <Controller
            control={groupControl}
            defaultValue=""
            name="message"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <TextArea
                  label="Message"
                  placeholder="Add a default message here (It can be edited)"
                  value={value}
                  onChange={onChange}
                />
              </Box>
            )}
          />
        </Box>

        <Box mt="41px">
          <Button
            full
            onClick={handleGroupSubmit(submitGroup)}
            isLoading={isLoadingPG}
          >
            Add Group
          </Button>
        </Box>
      </BaseModal>
    </>
  );
}
