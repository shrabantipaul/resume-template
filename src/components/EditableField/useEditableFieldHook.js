import { useEffect, useRef, useState } from "react";

const useEditableFieldHook = (
  value,
  isTextarea,
  onChange,
  field
) => {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);
  // Sync local value with parent value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(field, inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isTextarea) {
      setIsEditing(false);
      onChange(field, inputValue);
    }
  };
  return {
    inputRef,
    inputValue,
    setInputValue,
    handleClick,
    handleBlur,
    handleKeyDown,
    isEditing,
  };
};

export default useEditableFieldHook;
