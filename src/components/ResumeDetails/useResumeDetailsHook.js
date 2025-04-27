import { useState, useRef, useEffect } from "react";
import { html2pdf } from "html2pdf.js";

export const useResumeDetailsHook = (resumeData, setResumeData) => {
  const [newSection, setNewSection] = useState({ title: "", type: "text" });
  const [pdfMode, setPdfMode] = useState(false);

  const resumeRef = useRef(null); // Reference to resume content
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  const handlePersonalInfoChange = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value },
    });
  };

  const handleSectionContentChange = (sectionId, value) => {
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map((section) =>
        section.id === sectionId ? { ...section, content: value } : section
      ),
    });
  };

  const handleListItemFieldChange = (sectionId, itemId, field, value) => {
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? { ...item, fields: { ...item.fields, [field]: value } }
                  : item
              ),
            }
          : section
      ),
    });
  };
  const addListItem = (sectionId) => {
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map((section) =>
        section.id === sectionId && section.type === "list"
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: section.items.length + 1,
                  fields: {
                    ...(section.items[0]?.fields || {}),
                    ...Object.keys(section.items[0]?.fields || {}).reduce(
                      (acc, key) => ({ ...acc, [key]: "New " + key }),
                      {}
                    ),
                  },
                },
              ],
            }
          : section
      ),
    });
  };

  const removeListItem = (sectionId, itemId) => {
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      ),
    });
  };

  const addSection = () => {
    if (!newSection.title) return;
    const newSectionData = {
      id: Date.now().toString(),
      title: newSection.title,
      type: newSection.type,
      content: "New content",
    };
    setResumeData({
      ...resumeData,
      sections: [...resumeData.sections, newSectionData],
    });
    setNewSection({ title: "", type: "text" });
  };

  const removeSection = (sectionId) => {
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.filter(
        (section) => section.id !== sectionId
      ),
    });
  };

  const downloadPDF = () => {
    if (!window.html2pdf) {
      console.error("html2pdf.js is not loaded");
      alert("PDF generation library failed to load. Please try again.");
      return;
    }

    const element = resumeRef.current;
    if (!element) {
      console.error("Resume content element not found");
      alert("Unable to find resume content. Please try again.");
      return;
    }

    setPdfMode(true); // Enable PDF mode
    setTimeout(() => {
      html2pdf()
        .from(element)
        .set({
          margin: 0.5,
          filename: "resume.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          console.log("PDF generated successfully", pdf);
          setPdfMode(false); // Revert to normal mode
        })
        .save()
        .catch((error) => {
          console.error("PDF generation failed:", error);
          alert("Failed to generate PDF. Check the console for details.");
          setPdfMode(false); // Revert even on error
        });
    }, 100); // 100ms delay for render
  };
  return {
    newSection,
    setNewSection,
    addSection,
    pdfMode,
    downloadPDF,
    resumeRef,
    handlePersonalInfoChange,
    removeSection,
    handleSectionContentChange,
    handleListItemFieldChange,
    removeListItem,
    addListItem,
  };
};
