import ResumeDisplay from "../ResumeDetails/ResumeDetails";
import { useAddResumeHook } from "./useAddResumeHook";

const AddResume = () => {
  const {errors, resumeData, file, urlInput, setUrlInput, setResumeData, loading, resetStates, handleFileChange, handleExtract} = useAddResumeHook();
  
  return !resumeData ? (
    <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
        Extract Resume
      </h2>

      <form onSubmit={handleExtract} className="space-y-4">
        <div>
          <label
            htmlFor="urlInput"
            className="block text-gray-300 text-sm mb-2"
          >
            Enter LinkedIn URL
          </label>
          <input
            type="text"
            id="urlInput"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500 ${
              loading || file
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || file}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://www.linkedin.com/in/..."
            value={urlInput}
          />
          {urlInput.length && errors.url ? (
            <p className="text-red-500 text-sm mb-2">{errors.url}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="resumeFile"
            className="block text-gray-300 text-sm mb-2"
          >
            Choose Resume PDF
          </label>
          <div className={`relative border rounded w-full bg-gray-700`}>
            <input
              type="file"
              id="resumeFile"
              className={`absolute top-0 left-0 w-full h-full opacity-0 ${
                loading || urlInput.length
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              accept=".pdf"
              disabled={loading || urlInput.length}
              onChange={handleFileChange}
            />
            <div className="py-2 px-3 text-gray-300">
              {file ? file.name : "Choose file"}
            </div>
          </div>
          {errors.file && (
            <p className="text-red-500 text-sm mb-2">{errors.file}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={(!file && !urlInput.length) || loading}
          className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            (!file && !urlInput.length) || loading
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Extracting details..." : "Extract Details"}
        </button>
      </form>
    </div>
  ) : (
    <>
      <button
        className="absolute top-4 left-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={resetStates}
      >
        Import new resume data
      </button>
      <ResumeDisplay resumeData={resumeData} setResumeData={setResumeData} />
    </>
  );
};

export default AddResume;
