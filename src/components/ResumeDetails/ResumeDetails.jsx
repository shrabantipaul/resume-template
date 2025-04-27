import EditableField from "../EditableField/EditableField";
import { useResumeDetailsHook } from "./useResumeDetailsHook";

const ResumeDisplay = ({ resumeData, setResumeData }) => {
  const {
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
  } = useResumeDetailsHook(resumeData, setResumeData);
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 mt-10 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Add New Section
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Section Title"
              value={newSection.title}
              onChange={(e) =>
                setNewSection({ ...newSection, title: e.target.value })
              }
              className="p-2 border rounded flex-1"
            />
            <button
              onClick={() => {
                setNewSection({ ...newSection, type: "text" });
                addSection();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Section
            </button>
          </div>
        </div>
      </div>

      {!pdfMode && (
        <button
          onClick={downloadPDF}
          className="bg-blue-500 w-4xl text-white px-4 py-2 rounded hover:bg-blue-600 mb-8 mx-8"
        >
          Download as PDF
        </button>
      )}

      <div
        id="resume-content"
        ref={resumeRef}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8"
      >
        <header className="text-center mb-8">
          <EditableField
            value={resumeData.personalInfo.name}
            onChange={handlePersonalInfoChange}
            field="name"
            className="text-4xl font-bold text-gray-800"
            pdfMode={pdfMode}
          />
          <div className="flex justify-center gap-4 mt-2">
            <EditableField
              value={resumeData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              field="email"
              className="text-gray-600"
              pdfMode={pdfMode}
            />
            <EditableField
              value={resumeData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              field="phone"
              className="text-gray-600"
              pdfMode={pdfMode}
            />
          </div>
        </header>

        {resumeData.sections.map((section) => (
          <section key={section.id} className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
                {section.title}
              </h2>
              {!pdfMode && (
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Section
                </button>
              )}
            </div>

            {section.type === "text" && (
              <div className="mt-2">
                <EditableField
                  value={section.content}
                  onChange={(e, v) => handleSectionContentChange(section.id, v)}
                  field={`section-${section.id}`}
                  isTextarea
                  className="text-gray-600"
                  pdfMode={pdfMode}
                />
              </div>
            )}

            {section.type === "list" && (
              <div>
                {section.items.map((item) => (
                  <div key={item.id} className="mt-4">
                    <div className="flex justify-between">
                      <div className="w-[90%]">
                        {Object.entries(item.fields).map(
                          ([field, value], index) => (
                            <div key={field}>
                              <EditableField
                                value={value}
                                isTextarea
                                onChange={(f, v) =>
                                  handleListItemFieldChange(
                                    section.id,
                                    item.id,
                                    field,
                                    v
                                  )
                                }
                                field={`field-${section.id}-${item.id}-${field}`}
                                className={
                                  index === 0
                                    ? "text-lg font-semibold"
                                    : "text-gray-600"
                                }
                                pdfMode={pdfMode}
                              />
                            </div>
                          )
                        )}
                      </div>
                      {!pdfMode && section.items.length !== 1 && (
                        <button
                          onClick={() => removeListItem(section.id, item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {!pdfMode && (
                  <button
                    onClick={() => addListItem(section.id)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Item
                  </button>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ResumeDisplay;
