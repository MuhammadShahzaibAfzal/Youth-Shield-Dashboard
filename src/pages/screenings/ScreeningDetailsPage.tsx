import { getScreening } from "@/http/screening";
import type { ILevel, IQuestion, IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "./tabs/QuestionsTab";
import InterpretationsTab from "./tabs/InterpretationsTab";
import SummaryTab from "./tabs/SummaryTab";

const ScreeningDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [interpretations, setInterpretations] = useState<ILevel[]>([]);

  const { data: screening, isLoading } = useQuery<IScreening>({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!screening) return;
    setQuestions(screening?.questions || []);
    setInterpretations(screening?.interpretations || []);
  }, [screening]);

  if (isLoading) return <div>Loading...</div>;

  if (!screening) return <div>Screening not found</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{screening.name}</h2>
      <Tabs defaultValue="details" className="w-full my-8">
        <TabsList className="w-full">
          <TabsTrigger value="details">Screening Details</TabsTrigger>
          <TabsTrigger value="questions">Screening Questions</TabsTrigger>
          <TabsTrigger value="interpretations">Screening Interpretations</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <SummaryTab screening={screening} />
        </TabsContent>
        <TabsContent value="questions">
          <QuestionsTab
            questions={questions}
            setQuestions={setQuestions}
            screening={screening}
          />
        </TabsContent>
        <TabsContent value="interpretations">
          <InterpretationsTab
            interpretations={interpretations}
            setInterpretations={setInterpretations}
            screening={screening}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ScreeningDetailsPage;
