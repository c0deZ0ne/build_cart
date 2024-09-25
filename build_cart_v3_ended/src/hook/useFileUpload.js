import axios from "axios";
import { useEffect, useRef, useState } from "react";

/**
 * @typedef {Object} UploadHookResult
 * @property {number} progress - The number of kilobytes uploaded.
 * @property {number} progressPercentage - The upload progress in percentage.
 * @property {(url: string, file: File, controller: AbortController) => Promise<void>} uploadFile - Function to initiate file upload.
 * @property {boolean} isComplete - Indicates whether the file upload process has been successfully completed.
 * @property {boolean} isLoading - Indicates whether the file upload process is currently in progress, signifying a loading state.
 * @property {() => void} cancelUpload - A function to manually cancel the ongoing file upload process.
 */

/**
 * Custom React hook for file upload with progress tracking.
 * @returns {UploadHookResult} Returns information about the file upload progress and the upload function.
 */
const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef(new AbortController());
  const uploadFile = useRef(async (url, file) => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      controllerRef.current = controller; // Store the new controller
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(url, formData, {
        signal: controller.signal,
        onUploadProgress: (event) => {
          const { loaded, bytes } = event;
          setProgress(loaded / 1000);
          console.log(
            event.progress,
            Math.round(event.progress * 100),
            bytes,
            "her"
          );
          setProgressPercentage(Math.round(event.progress * 100));
        },
      });

      setIsComplete(true);

      // Handle the response here if needed
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const cancelUpload = () => {
    controllerRef.current.abort(); // Abort the ongoing upload
    setIsLoading(false);
  };

  useEffect(() => {
    const cleanup = () => {
      setProgress(0);
      setProgressPercentage(0);
      setIsComplete(false);
    };

    return cleanup;
  }, []);

  return {
    uploadFile: uploadFile.current,
    progress,
    progressPercentage,
    isComplete,
    isLoading,
    cancelUpload,
  };
};

export default useFileUpload;
