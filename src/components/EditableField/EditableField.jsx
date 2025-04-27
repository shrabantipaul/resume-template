import useEditableFieldHook from "./useEditableFieldHook";

const EditableField = ({
  value,
  onChange,
  field,
  isTextarea = false,
  className = "",
  pdfMode,
}) => {
  const {
    inputRef,
    inputValue,
    setInputValue,
    handleClick,
    handleBlur,
    handleKeyDown,
    isEditing,
  } = useEditableFieldHook(
    value,
    isTextarea,
    onChange,
    field
  );
  const Element = isTextarea ? "textarea" : "input";

  // Skip editable logic in pdfMode
  if (pdfMode) {
    return isTextarea ? (
      <p className={className}>{value}</p>
    ) : (
      <span className={className}>{value}</span>
    );
  }
  return (
    <Element
      ref={inputRef}
      style={{ overflow: "hidden", resize: "none" }}
      type={isTextarea ? undefined : "text"}
      value={inputValue || ""}
      onChange={(e) => setInputValue(e.target.value)}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      readOnly={!isEditing}
      rows={1}
      className={`w-full ${
        isTextarea ? "p-2" : "p-1"
      } border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isEditing ? "" : "bg-transparent border-transparent cursor-pointer"
      } ${className}`}
    />
  );
};

export default EditableField;
