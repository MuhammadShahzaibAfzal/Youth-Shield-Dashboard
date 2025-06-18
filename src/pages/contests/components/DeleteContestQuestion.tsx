import useUpdateContest from "@/hooks/useUpdateContest";
import type { IContest, IContestQuestion } from "@/types";
import { FaTrash } from "react-icons/fa";

interface IProps {
  question: IContestQuestion;
  setQuestions: React.Dispatch<React.SetStateAction<IContestQuestion[]>>;
  contest: IContest;
  questions: IContestQuestion[];
}

const DeleteContestQuestion = ({
  question,
  setQuestions,
  contest,
  questions,
}: IProps) => {
  const { handleUpdate, isLoading } = useUpdateContest({
    contestID: contest._id as string,
  });
  const handleDelete = () => {
    // if question exist in screening then remove from backend also
    const existingQuestion = contest?.questions?.find((q) => q._id === question._id);
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
export default DeleteContestQuestion;
