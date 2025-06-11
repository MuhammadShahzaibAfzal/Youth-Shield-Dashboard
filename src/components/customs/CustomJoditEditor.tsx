import { useRef } from "react";
import JoditEditor from "jodit-react";
import { config } from "@/lib/utils";

const CustomJoditEditor = ({
  setContent,
  content,
}: {
  setContent: (content: string) => void;
  content: string;
}) => {
  const editor = useRef(null);
  return (
    <div className="myjoditEditor">
      <JoditEditor
        ref={editor}
        value={content}
        onBlur={(newContent: string) => setContent(newContent)}
        config={config}
        className="bg-red-500"
      />
    </div>
  );
};
export default CustomJoditEditor;
