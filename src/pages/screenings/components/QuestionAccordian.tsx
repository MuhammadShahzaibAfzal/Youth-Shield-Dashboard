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
import CustomSelect from "@/components/customs/CustomSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultHeightOptions } from "@/lib/utils";

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
          const updatedQuestion = {
            ...q,
            [key]: value,
          };

          // When changing to height-weight type, add default options if none exist
          if (key === "type" && value === "height-weight" && !q.heightOptions?.length) {
            updatedQuestion.heightOptions = defaultHeightOptions.map((option) => ({
              ...option,
              _id: uuidv4(), // Generate new IDs for each option
              weights: option.weights.map((weight) => ({
                ...weight,
                _id: uuidv4(), // Generate new IDs for each weight
              })),
            }));
          }

          // When changing from height-weight to another type, clear heightOptions
          if (key === "type" && value !== "height-weight" && q.heightOptions) {
            updatedQuestion.heightOptions = undefined;
          }

          return updatedQuestion;
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

  const addHeightOption = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === question._id
          ? {
              ...q,
              heightOptions: [
                ...(q.heightOptions || []),
                {
                  _id: uuidv4(),
                  height: "",
                  weights: [
                    { _id: uuidv4(), weight: "", score: 0 },
                    { _id: uuidv4(), weight: "", score: 1 },
                    { _id: uuidv4(), weight: "", score: 2 },
                    { _id: uuidv4(), weight: "", score: 3 },
                  ],
                },
              ],
            }
          : q
      )
    );
  };

  const removeHeightOption = (heightId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === question._id
          ? {
              ...q,
              heightOptions: q.heightOptions?.filter((h) => h._id !== heightId) || [],
            }
          : q
      )
    );
  };

  const handleHeightChange = (heightId: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === question._id
          ? {
              ...q,
              heightOptions:
                q.heightOptions?.map((h) =>
                  h._id === heightId ? { ...h, height: value } : h
                ) || [],
            }
          : q
      )
    );
  };

  const handleWeightChange = (heightId: string, weightId: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === question._id
          ? {
              ...q,
              heightOptions:
                q.heightOptions?.map((h) =>
                  h._id === heightId
                    ? {
                        ...h,
                        weights: h.weights.map((w) =>
                          w._id === weightId ? { ...w, weight: value } : w
                        ),
                      }
                    : h
                ) || [],
            }
          : q
      )
    );
  };

  const handleSave = () => {
    // VALIDATION. Not Options texts and question text is empty
    if (!question.text) {
      toast.error("Question text is required");
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
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Question</Label>
              <Input
                value={question.text}
                onChange={(e) => handleQuestionChange("text", e.target.value)}
              />
            </div>
            <div>
              <Label>Question Type</Label>
              <CustomSelect
                className="w-48"
                value={question.type}
                setValue={(value) => handleQuestionChange("type", value as string)}
                options={[
                  { value: "multiple", label: "Multiple Choice" },
                  { value: "text", label: "Text" },
                  { value: "date", label: "Date" },
                  { value: "number", label: "Number" },
                  { value: "textarea", label: "Textarea" },
                  { value: "dropdown", label: "Dropdown" },
                  { value: "height-weight", label: "Height-Weight" },
                  // { value: "radio", label: "Radio" },
                ]}
              />
            </div>
          </div>
          {(question?.type === "multiple" ||
            question?.type === "radio" ||
            question?.type === "dropdown") && (
            <div className="grid  grid-cols-2 gap-6">
              {question.options?.map((option, index) => (
                <div key={index}>
                  <div className="flex mb-1 justify-between items-center">
                    <Label>Option {index + 1}</Label>
                  </div>
                  <div className="flex items-center rounded-lg py-0 border shadow focus:ring-1 focus-visible:ring-1">
                    <Input
                      value={option.text}
                      className="flex-1 border-0 shadow-none focus:ring-0 focus-visible:ring-0"
                      onChange={(e) =>
                        handleOptionChange(option._id as string, "text", e.target.value)
                      }
                    />
                    <div className="flex items-center">
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
                      <span className="px-2 text-sm text-gray-500">pts</span>
                    </div>
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
          )}

          {question?.type === "height-weight" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Height</TableHead>
                    <TableHead>Weight (lbs) - 0 Point</TableHead>
                    <TableHead>Weight (lbs) - 1 Point</TableHead>
                    <TableHead>Weight (lbs) - 2 Point</TableHead>
                    <TableHead>Weight (lbs) - 3 Point</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {question.heightOptions?.map((heightOption) => (
                    <TableRow key={heightOption._id}>
                      <TableCell>
                        <Input
                          value={heightOption.height}
                          onChange={(e) =>
                            handleHeightChange(heightOption._id as string, e.target.value)
                          }
                          placeholder="e.g. 5'8"
                        />
                      </TableCell>
                      {heightOption.weights.map((weight) => (
                        <TableCell key={weight._id}>
                          <Input
                            value={weight.weight}
                            onChange={(e) =>
                              handleWeightChange(
                                heightOption._id as string,
                                weight._id as string,
                                e.target.value
                              )
                            }
                            placeholder={`Weight for ${weight.score} pts`}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <button
                          onClick={() => removeHeightOption(heightOption._id as string)}
                          className="cursor-pointer"
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={addHeightOption} variant="outline" className="mt-4">
                <FaPlus className="mr-2" /> Add Height Option
              </Button>
            </div>
          )}

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
