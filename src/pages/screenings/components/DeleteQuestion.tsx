import useUpdateScreening from "@/hooks/useUpdateScreening";
import type { IQuestion, IScreening } from "@/types";
import { FaTrash } from "react-icons/fa";

interface IProps {
  question: IQuestion;
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
  screening: IScreening;
  questions: IQuestion[];
}

const DeleteQuestion = ({ question, setQuestions, screening, questions }: IProps) => {
  const { handleUpdate, isLoading } = useUpdateScreening({
    screeningID: screening._id as string,
  });
  const handleDelete = () => {
    // if question exist in screening then remove from backend also
    const existingQuestion = screening?.questions?.find((q) => q._id === question._id);
    if (existingQuestion) {
      const data = new FormData();
      data.append(
        "questions",
        JSON.stringify(questions?.filter((q) => q._id !== question._id) || [])
      );
      handleUpdate(data);
    } else {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q._id !== question._id)
      );
    }
  };
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        disabled={isLoading}
        className="cursor-pointer"
      >
        <FaTrash />
      </button>
    </>
  );
};
export default DeleteQuestion;
