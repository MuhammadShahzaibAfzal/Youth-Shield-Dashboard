import { getScreening } from "@/http/screening";
import type { IQuestion, IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UpdateScreening from "./components/UpdateScreening";
import DeleteScreening from "./components/DeleteScreening";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "./tabs/QuestionsTab";
import InterpretationsTab from "./tabs/InterpretationsTab";

const ScreeningDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { data: screening, isLoading } = useQuery<IScreening>({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!screening || !screening?.questions) return;
    setQuestions(screening?.questions || []);
  }, [screening]);

  if (isLoading) return <div>Loading...</div>;

  if (!screening) return <div>Screening not found</div>;

  return (
    <div>
      <Card className="flex flex-row items-center gap-4 py-0 overflow-hidden">
        <img
          src={screening.imageURL}
          alt={screening.name}
          className="w-[300px] h-[300px] object-cover"
        />
        <div className="px-4 py-4">
          <h2 className="text-xl font-semibold mb-2">{screening.name}</h2>
          <p className="text-muted-foreground">{screening.description}</p>
          <div className="flex justify-start gap-4 mt-4">
            <UpdateScreening screening={screening} />
            <DeleteScreening screening={screening} />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="questions" className="w-full my-8">
        <TabsList className="w-full">
          <TabsTrigger value="questions">Screening Questions</TabsTrigger>
          <TabsTrigger value="interpretations">Screening Interpretations</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          <QuestionsTab
            questions={questions}
            setQuestions={setQuestions}
            screening={screening}
          />
        </TabsContent>
        <TabsContent value="interpretations">
          <InterpretationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ScreeningDetailsPage;
