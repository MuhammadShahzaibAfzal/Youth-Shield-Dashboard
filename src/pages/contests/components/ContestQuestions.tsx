import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useUpdateContest from "@/hooks/useUpdateContest";
import type { IContest, IContestQuestion } from "@/types";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import ContestQuestionAccordian from "./ContestQuestionAccordian";

const ContestQuestions = ({
  questions,
  setQuestions,
  contest,
}: {
  questions: IContestQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<IContestQuestion[]>>;
  contest: IContest;
}) => {
  const { handleUpdate } = useUpdateContest({ contestID: contest._id! });
  const [openDefault, setOpenDefault] = useState<string | null>(null);
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      console.log(active.id, over?.id);
      const oldIndex = questions.findIndex((q) => q._id === active.id);
      const newIndex = questions.findIndex((q) => q._id === over?.id);
      setQuestions((prevQuestions) => arrayMove(prevQuestions, oldIndex, newIndex));
      const formData = new FormData();
      formData.append(
        "questions",
        JSON.stringify(arrayMove(questions, oldIndex, newIndex))
      );
      handleUpdate(formData);
    }
  };

  const handleAddQuestion = () => {
    const highestOrder =
      questions.length > 0 ? Math.max(...questions.map((q) => q.order)) : 1;
    const id = uuidv4();
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        text: "",
        _id: id,
        options: Array(4)
          .fill(null)
          .map(() => ({
            text: "",
            score: 0,
            _id: uuidv4(),
          })),

        order: highestOrder + 1,
        type: "multiple",
      },
    ]);
    setOpenDefault(id);
  };
  return (
    <div>
      <div className="flex mt-4 justify-between items-center gap-4">
        <div>
          <h2 className="mt-4 mb-2 uppercase text-xl font-semibold">Questions</h2>
          {questions?.length === 0 && (
            <p className="text-muted-foreground">No questions added yet. </p>
          )}
        </div>
        <Button onClick={handleAddQuestion}>
          <FaPlus /> Add Question
        </Button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={
            questions?.map((q) => {
              return {
                ...q,
                id: q._id as string,
              };
            }) || []
          }
          strategy={rectSortingStrategy}
        >
          <Accordion
            value={openDefault || undefined}
            className="w-full my-4 space-y-3"
            type="single"
            collapsible
            onValueChange={(value) => setOpenDefault(value as string)}
          >
            {questions?.map((question, index) => {
              return (
                <ContestQuestionAccordian
                  key={question._id}
                  question={question}
                  setQuestions={setQuestions}
                  contestID={contest._id as string}
                  questions={questions}
                  contest={contest}
                  index={index}
                />
              );
            })}
          </Accordion>
        </SortableContext>
      </DndContext>
    </div>
  );
};
export default ContestQuestions;
