import { getScreening } from "@/http/screening";
import type { IQuestion, IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UpdateScreening from "./components/UpdateScreening";
import DeleteScreening from "./components/DeleteScreening";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import QuestionAccordian from "./components/QuestionAccordian";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ScreeningDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [openDefault, setOpenDefault] = useState<string | null>(null);
  const { data: screening, isLoading } = useQuery<IScreening>({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!screening || !screening?.questions) return;
    setQuestions(screening?.questions || []);
  }, [screening]);

  const handleAddQuestion = () => {
    const highestOrder =
      questions.length > 0 ? Math.max(...questions.map((q) => q.order)) : 1;
    const id = uuidv4();
    setQuestions((prevQuestions) => [
      {
        text: "",
        _id: id,
        options: [
          {
            text: "",
            score: 0,
            _id: uuidv4(),
          },
        ],
        order: highestOrder + 1,
        type: "multiple",
      },
      ...prevQuestions,
    ]);
    setOpenDefault(id);
  };

  console.log("screening", screening);

  if (isLoading) return <div>Loading...</div>;

  if (!screening) return <div>Screening not found</div>;

  return (
    <div>
      <Card className="flex flex-row items-center gap-4 py-0 overflow-hidden">
        <img
          src={screening.imageURL}
          alt={screening.name}
          className="w-[250px] h-[200px] object-cover"
        />
        <div className="px-4">
          <h2 className="text-xl font-semibold mb-2">{screening.name}</h2>
          <p className="text-muted-foreground">{screening.description}</p>
          <div className="flex justify-start gap-4 mt-4">
            <UpdateScreening screening={screening} />
            <DeleteScreening screening={screening} />
          </div>
        </div>
      </Card>
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
      <Accordion
        value={openDefault || undefined}
        className="w-full my-4 space-y-3"
        type="single"
        collapsible
        onValueChange={(value) => setOpenDefault(value as string)}
      >
        {questions?.map((question) => {
          return (
            <QuestionAccordian
              key={question._id}
              question={question}
              setQuestions={setQuestions}
              screeningID={screening._id as string}
              questions={questions}
              screening={screening}
            />
          );
        })}
      </Accordion>
    </div>
  );
};
export default ScreeningDetailsPage;
