import React, { forwardRef, useEffect, useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaPlus } from "react-icons/fa6";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../../../redux/api/builder/projectSlice";
import {
  Box,
  FormLabel,
  HStack,
  useToast,
  Button as ChakraButton,
  Text,
  Flex,
  CircularProgress,
} from "@chakra-ui/react";
import Input, { TextArea } from "../../../../components/Input";
import SuccessMessage from "../../../../components/SuccessMessage";
import SelectSearch from "../../../../components/SelectSearch";
import Button from "../../../../components/Button";
import { handleError } from "../../../../utility/helpers";
import { fetchStates, uploadImage } from "../../../../utility/queries";
import Upload from "../../../../components/Icons/Upload";
import { IoIosCloseCircle } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../../../components/Icons/Calendar";
import instance from "../../../../utility/webservices";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";

export default function CreateProject({
  refetch,
  isOpen,
  onClose,
  project = null,
}) {
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [fundManagers, setFundManagers] = useState([]);
  const [states, setStates] = useState([]);
  const [showSelectFundManager, setShowSelectFundManager] = useState(false);
  const [openFundManagerInvite, setOpenFundManagerInvite] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [imagePlaceholder, setImagePlaceholder] = useState("Upload 3D image");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [randomImgKey, setRandomImgKey] = useState(Math.random());
  const [fundManagerInvite, setFundManagerInvite] = useState(false);
  const [fundManagerInviteData, setFundManagerInviteData] = useState({});
  const [isCloseSearch, setCloseSearch] = useState(false);

  const imageHandler = async (e) => {
    if (e.target.files[0] === null) return false;
    setImage(e.target.files[0]);
    setImagePlaceholder(e.target.files[0].name);
  };

  const toast = useToast();

  const createProjectSchema = yup.object({
    projectTile: yup.string().required("Project title is required"),
    startDate: yup.string().required("Project start date is required"),
    endDate: yup.string().required("Project end date is required"),
    projectLocation: yup.object().required("Project location is required"),
  });

  const inviteFundManagerSchema = yup.object({
    email: yup.string().required("Fund manager email is required").email(),
  });

  const methods = useForm({
    defaultValues: {
      projectTile: "",
      projectDesc: "",
      startDate: "",
      endDate: "",
      selectFundManager: "",
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

  useEffect(() => {
    const stateCopy = [...states];
    const projstate = stateCopy.find((e) => e.label === project?.location);
    if (project) {
      setValue("projectTile", project.title);
      setValue("startDate", new Date(project.startDate));
      setValue("endDate", new Date(project.endDate));
      setValue("projectDesc", project.description);
      setValue("projectLocation", projstate);
      setImagePlaceholder(project?.image?.split("/").pop());
      setEditImageUrl(project?.image);
    }

    getFundManagers();
  }, [project, setValue, states]);

  const getStates = async () => {
    const statesData = await fetchStates();

    const stateArr = statesData.states.map((e, i) => ({
      value: e.name,
      label: e.name,
    }));
    setStates(stateArr);
  };

  useEffect(() => {
    getStates();
  }, []);

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
    let img = {};

    if (image) {
      setLoading(true);
      img = await uploadImage(image, "image", onUploadProgress);
    }

    if (project?.id) {
      updateProject({
        payload: {
          location: data?.projectLocation?.label,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          title: data.projectTile,
          description: data.projectDesc,
          newFundManagers: data?.selectFundManager
            ? [data?.selectFundManager?.id]
            : [],
          projectMedia: img
            ? [
                {
                  url: img.url ?? editImageUrl,
                  title: imageName ? imageName : imagePlaceholder,
                  mediaType: "IMAGE",
                  description: `This is a 3D image of builder project ${data.projectTile}`,
                },
              ]
            : [],
        },
        id: project.id,
      });
    } else {
      createProject({
        location: data?.projectLocation?.label,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        title: data.projectTile,
        description: data.projectDesc,
        newFundManagers: data?.selectFundManager
          ? [data?.selectFundManager?.id]
          : [],
        projectMedia: img
          ? [
              {
                url: img.url,
                title: imageName ? imageName : imagePlaceholder,
                mediaType: "IMAGE",
                description: `This is a 3D image of builder project ${data.projectTile}`,
              },
            ]
          : [],
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
      toast({
        description: handleError(createError || updateError),
        status: "error",
        position: "top-right",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading, updateLoading]);

  useEffect(() => {
    if (!isOpen && project == null) {
      reset();
      setShowSelectFundManager(false);
    }
  }, [isOpen, reset, project]);

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
    resolver: yupResolver(inviteFundManagerSchema),
  });

  const submitInvite = (data) => {
    console.log(data);

    const payload = {
      toEmail: data?.email,
      message: data?.message,
    };

    setFundManagerInvite(true);
    setFundManagerInviteData(payload);
    setOpenFundManagerInvite(false);
    setCloseSearch(!isCloseSearch);
    setValue("selectFundManager", { name: data?.email, id: data?.email });
    clearErrors("selectFundManager");
  };

  useEffect(() => {
    if (!openFundManagerInvite) {
      resetInvite();
      setOpenFundManagerInvite(false);
    }
  }, [openFundManagerInvite, resetInvite]);

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

  const getFundManagers = async () => {
    //Todo: To implement page size
    try {
      const { data } = (
        await instance.get(`/builder/my/fundmanagers?page_size=5000`)
      ).data;

      const fm = data?.FundManagers.map((e) => ({
        name: e?.FundManager?.businessName,
        id: e?.FundManager?.id,
      }));

      setFundManagers(fm);
    } catch (error) {
      console.log(error);
    }
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
          setFundManagerInvite(false);
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
          <form onSubmit={handleSubmit(submitProject)}>
            <Box mb={"24px"}>
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

            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="projectDesc"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <TextArea
                      label="Project Description"
                      placeholder="Add Project Description..."
                      value={value}
                      onChange={onChange}
                    />
                    <div style={{ color: "red" }}>
                      {errors["projectDesc"]
                        ? errors["projectDesc"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb="24px">
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
                        imageHandler(e);
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

            <Box mb="24px">
              <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                Project Duration <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <HStack
                mb={"24px"}
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
                          onChange={onChange}
                          customInput={<StartDate />}
                          wrapperClassName="datepicker_width"
                          showMonthDropdown
                          minDate={new Date()}
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
                          customInput={<EndDate />}
                          minDate={new Date()}
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

            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
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

            {showSelectFundManager && (
              <Box mb={"24px"}>
                <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                  Project Fund Manager <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Controller
                  control={control}
                  defaultValue=""
                  name="selectFundManager"
                  render={({ field: { onChange, value } }) => (
                    <Box w={"100%"}>
                      <SelectSearch
                        placeholder="Select Project Fund Manager"
                        data={fundManagers}
                        // setSelectOption={onChange}
                        selectOption={value}
                        setSelectOption={(item) => {
                          onChange(item);
                          setFundManagerInvite(false);
                        }}
                        showInvite={true}
                        inviteText="Add Fund Manager"
                        setOpenInvite={setOpenFundManagerInvite}
                        isCloseSearch={isCloseSearch}
                      />
                    </Box>
                  )}
                />
              </Box>
            )}

            {!showSelectFundManager && (
              <ChakraButton
                variant="link"
                color="#F5852C"
                ml="auto"
                display="flex"
                onClick={() => setShowSelectFundManager(true)}
              >
                <FaPlus />
                Add Project Fund Manager
              </ChakraButton>
            )}
            <div style={{ fontWeight: "600", color: "green" }}>
              {fundManagerInvite && "You are inviting a fund manager"}
            </div>
            <Box mt="41px">
              <Button
                full
                isSubmit
                isLoading={
                  loading ? loading : project ? updateLoading : createLoading
                }
              >
                {project ? "Update" : "Create"} Project
              </Button>
            </Box>
          </form>
        )}
      </BaseModal>
      <BaseModal
        isOpen={openFundManagerInvite}
        onClose={() => setOpenFundManagerInvite(false)}
        title="Add Fund Manager"
        subtitle="Add a Fund manager to Finance your project"
        size="xl"
      >
        <form onSubmit={handleInviteSubmit(submitInvite)}>
          <Box mb={"24px"}>
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

          <Box mb={"24px"}>
            <Controller
              control={inviteControl}
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
            <Button full isSubmit>
              Send Invite
            </Button>
          </Box>
        </form>
      </BaseModal>
    </>
  );
}
