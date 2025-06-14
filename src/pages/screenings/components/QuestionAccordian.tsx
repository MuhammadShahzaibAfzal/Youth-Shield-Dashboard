/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IQuestion, IScreening } from "@/types";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import DeleteQuestion from "./DeleteQuestion";
import useUpdateScreening from "@/hooks/useUpdateScreening";
import { Loader2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { toast } from "sonner";

interface IProps {
  question: IQuestion;
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
  screeningID: string;
  questions: IQuestion[];
  screening: IScreening;
  index: number;
}
const QuestionAccordian = ({
  question,
  setQuestions,
  screeningID,
  questions,
  screening,
  index,
}: IProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question._id as string,
  });
  const { handleUpdate, isLoading } = useUpdateScreening({ screeningID });
  const handleQuestionChange = (key: string, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) => {
        if (q._id === question._id) {
          return {
            ...q,
            [key]: value,
          };
        }
        return q;
      });
      return updatedQuestions;
    });
  };

  const handleOptionChange = (_id: string, key: string, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) => {
        if (q._id === question._id) {
          return {
            ...q,
            options: q.options?.map((option) => {
              if (option._id === _id) {
                return {
                  ...option,
                  [key]: value,
                };
              }
              return option;
            }),
          };
        }
        return q;
      });
      return updatedQuestions;
    });
  };

  const addOption = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) => {
        if (q._id === question._id) {
          return {
            ...q,
            options: [...(q.options || []), { _id: uuidv4(), text: "", score: 0 }],
          };
        }
        return q;
      });
      return updatedQuestions;
    });
  };

  const removeOption = (_id: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) => {
        if (q._id === question._id) {
          return {
            ...q,
            options: q.options?.filter((option) => option._id !== _id),
          };
        }
        return q;
      });
      return updatedQuestions;
    });
  };

  const handleSave = () => {
    // VALIDATION. Not Options texts and question text is empty
    if (!question.text) {
      toast.error("Question text is required");
      return;
    }
    if (question.options?.some((option) => option.text === "")) {
      toast.error("Option text is required");
      return;
    }
    const formData = new FormData();
    formData.append("questions", JSON.stringify(questions));
    handleUpdate(formData);
  };
  return (
    <AccordionItem
      value={question._id as string}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      ref={setNodeRef}
    >
      <AccordionTrigger
        className="border"
        RightDiv={
          <div className="flex items-center gap-3">
            <DeleteQuestion
              question={question as any}
              setQuestions={setQuestions}
              screening={screening}
              questions={questions}
            />
          </div>
        }
        LeftDiv={
          <div className="flex items-center gap-3">
            <button
              className="cursor-grabbing"
              onClick={(e) => {
                e.stopPropagation();
              }}
              {...attributes}
              {...listeners}
            >
              <MdDragIndicator size={24} />
            </button>
            <span>{index + 1}.</span>
          </div>
        }
      >
        {question.text || "New Question"}
      </AccordionTrigger>
      <AccordionContent className="py-0">
        <div className="border bg-secondary space-y-7 border-t-0 p-4">
          <div>
            <Label>Question</Label>
            <Input
              value={question.text}
              onChange={(e) => handleQuestionChange("text", e.target.value)}
            />
          </div>
          <div className="grid  grid-cols-2 gap-6">
            {question.options?.map((option, index) => (
              <div key={index}>
                <div className="flex mb-1 justify-between items-center">
                  <Label>Option {index + 1}</Label>
                </div>
                <div className="flex  rounded-lg py-0 border shadow focus:ring-1 focus-visible:ring-1">
                  <Input
                    value={option.text}
                    className="flex-1 border-0 shadow-none focus:ring-0 focus-visible:ring-0"
                    onChange={(e) =>
                      handleOptionChange(option._id as string, "text", e.target.value)
                    }
                  />
                  <Input
                    className="w-20 border-0 border-l rounded-none bg-gray-100 shadow-none focus:ring-0 focus-visible:ring-0"
                    placeholder="Points"
                    type="number"
                    min="0"
                    value={option.score}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string or positive numbers
                      if (value === "" || /^\d+$/.test(value)) {
                        handleOptionChange(
                          option._id as string,
                          "score",
                          value === "" ? "" : (Number(value) as any)
                        );
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        handleOptionChange(option._id as string, "score", 0 as any);
                      }
                    }}
                  />
                  <button
                    onClick={() => removeOption(option._id as string)}
                    className="w-10 flex justify-center items-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 justify-end">
            <Button onClick={addOption} variant="outline">
              <FaPlus /> Add Option
            </Button>
            <Button onClick={handleSave}>
              {isLoading ? <Loader2 className="animate-spin" /> : <FaSave />} Save
              Question
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
export default QuestionAccordian;
