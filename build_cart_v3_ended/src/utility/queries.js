import axios from "axios";
import { createStandaloneToast } from "@chakra-ui/react";
import config from "./config";

const { toast } = createStandaloneToast();

export const validatePasswordRegex =
  /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

const user = JSON.parse(localStorage.getItem("userInfo"));

// TODO: This usertype information can be retrieved from the global store
function getUserType() {
  const userType = user?.userType;
  if (userType) return userType.toLowerCase();
  else return "";
}

export async function fetchStates(country = "nigeria") {
  try {
    const response = await axios.get(
      `https://countriesnow.space/api/v0.1/countries/states/q?country=${country}`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * NOTE: DO not include `withCredentials: true` & access control origin headers to this code as it will make the upload fail with cors
 */
export async function uploadFileFetch(formData, fileType, onUploadProgress) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_CLOUDINARY_APP_URL}/${fileType}/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );

          onUploadProgress && onUploadProgress(progress);
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);

    toast({
      description: "Error! while uploading document.",
      status: "error",
      position: "bottom-right",
      variant: "left-accent",
    });
    throw error;
  }
}

export const uploadImage2 = async (
  data,
  fileType,
  onUploadProgress,
  userType
) => {
  let formData = new FormData();
  formData.append(`file`, data);
  formData.append("api_key", config.CLOUD_KEY);
  formData.append("timestamp", (Date.now() / 1000) | 0);
  formData.append("upload_preset", "cutstruct");
  formData.append("folder", getUserType());
  const uploadImag = await uploadFileFetch(
    formData,
    fileType,
    // onUploadProgress
    (progress) => handleUploadProgress(progress, onUploadProgress)
  );
  return await uploadImag;
};

export const uploadImage = async (data, fileType, onUploadProgress) => {
  let formData = new FormData();
  formData.append(`file`, data);
  formData.append("api_key", config.CLOUD_KEY);
  formData.append("timestamp", (Date.now() / 1000) | 0);
  formData.append("upload_preset", "cutstruct");
  formData.append("folder", getUserType());
  const uploadImag = await uploadFileFetch(
    formData,
    fileType,
    onUploadProgress
  );
  return await uploadImag;
};

export const imageHandler = async (allFiles, progressCallback) => {
  let documents = [];
  if (allFiles[0] === null) return false;
  const files = allFiles;
  const docs = [...documents];

  for (let i = 0; i < files.length; i++) {
    let docTypeChecker = files[i]?.type.split("/")[0];
    let docType =
      docTypeChecker === "video"
        ? "video"
        : docTypeChecker === "image"
        ? "image"
        : "raw";

    let { length } = docs;
    docs.push({
      name: files[i]?.name,
      file: files[i],
      url: "",
      publicId: "",
    });

    documents = docs;

    const uploadfile = await uploadImage(
      files[i],
      docType,
      (progress) => handleUploadProgress(progress, progressCallback, i),
      getUserType()
    );

    docs[length].url = uploadfile?.url;
    docs[length].publicId = uploadfile?.public_id;

    documents = docs;
  }

  return documents;
};

export const handleUploadProgress = (progress, progressCallback, length) => {
  progressCallback(progress, length);
};
