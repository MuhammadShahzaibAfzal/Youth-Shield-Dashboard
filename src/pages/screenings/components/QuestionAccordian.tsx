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
import { FaPlus, FaSave } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import DeleteQuestion from "./DeleteQuestion";
import useUpdateScreening from "@/hooks/useUpdateScreening";
import { Loader2 } from "lucide-react";
interface IProps {
  question: IQuestion;
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
  screeningID: string;
  questions: IQuestion[];
  screening: IScreening;
}
const QuestionAccordian = ({
  question,
  setQuestions,
  screeningID,
  questions,
  screening,
}: IProps) => {
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

  const handleSave = () => {
    const formData = new FormData();
    formData.append("questions", JSON.stringify(questions));
    handleUpdate(formData);
  };
  return (
    <AccordionItem value={question._id as string}>
      <AccordionTrigger
        className="border"
        RightDiv={
          <div>
            <DeleteQuestion
              question={question as any}
              setQuestions={setQuestions}
              screening={screening}
              questions={questions}
            />
          </div>
        }
      >
        {question.text || "New Question"}
      </AccordionTrigger>
      <AccordionContent className="py-0">
        <div className="border space-y-4 border-t-0 p-4">
          <div>
            <Label>Question</Label>
            <Input
              value={question.text}
              onChange={(e) => handleQuestionChange("text", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {question.options?.map((option, index) => (
              <div key={index}>
                <Label>Option {index + 1}</Label>
                <div className="flex gap-4 rounded-lg py-0 border shadow focus:ring-1 focus-visible:ring-1">
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
                    value={option.score}
                    onChange={(e) =>
                      handleOptionChange(option._id as string, "score", e.target.value)
                    }
                  />
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
