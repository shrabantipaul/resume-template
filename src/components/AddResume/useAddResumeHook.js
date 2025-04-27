import { useState } from "react";
import { extractResumeDetails } from "../../utils/utils";

export const useAddResumeHook = () => {
  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [errors, setErrors] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // rest states when user wants to add new resume
  const resetStates = () => {
    setResumeData(null);
    setUrlInput("");
    setFile(null);
    setErrors("");
  };
  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle resume extraction
  const handleExtract = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        let data;
        if (urlInput) {
          // Process LinkedIn URL
          data = await extractResumeDetails(urlInput, "linkedin");
        } else if (file) {
          // Process PDF file (mock reading file content)
          data = await extractResumeDetails(file, "pdf");
        }
        setResumeData(data);
        setUrlInput("");
        setFile(null);
        setErrors("");
      } catch (err) {
        setErrors("Failed to extract data: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Validate the resume input (linkedIN url format)
  const validateForm = () => {
    let formErrors = {};

    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;
    if (!urlInput && !file) {
      formErrors.file = "LinkedIn URL or PDF file is required";
    } else if (!linkedInRegex.test(urlInput) && !file) {
      formErrors.url = "Enter a valid LinkedIn URL";
    } else if (file?.type !== "application/pdf" && !urlInput?.length) {
      formErrors.file = "Only PDF files are allowed";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };
  return {
    errors,
    resumeData,
    file,
    urlInput,
    setUrlInput,
    setResumeData,
    loading,
    resetStates,
    handleFileChange,
    handleExtract,
  };
};
