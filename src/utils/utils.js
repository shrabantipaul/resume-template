export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Mock LLM function to extract resume details
export const extractResumeDetails = async (input, type) => {
  try {
    let response;
    const formData = new FormData();
    if (type === "pdf") {
      formData.append("file", input);
    }
    response = await fetch(`/.netlify/functions/${type === "pdf" ? "scrape-pdf" : "scrape-linkedin"}`, {
      method: "POST",
      ...(type !=='pdf' && {headers: {
        'Content-Type': 'application/json', // Important!
      }}),
      body: type === "pdf" ? formData : JSON.stringify({ url: input }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const jsonString = data.replace("```json\n", "").replace("\n```", "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Import failed:", error);
    alert("Failed to import data. Check the console for details.");
  }
  return null;
};
