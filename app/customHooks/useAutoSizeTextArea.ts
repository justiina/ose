import { useLayoutEffect } from "react";

const useAutoSizeTextArea = (
  id: string,
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  // Calculate the height of textArea before DOM paints
  useLayoutEffect(() => {
    const textArea = textAreaRef ?? document.getElementById(id);

    if (textArea) {
      // Reset the height momentarily to get the correct scrollHeight 
      // for the textarea
      textArea.style.height = "0px";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, id, value]);
};

export default useAutoSizeTextArea;
