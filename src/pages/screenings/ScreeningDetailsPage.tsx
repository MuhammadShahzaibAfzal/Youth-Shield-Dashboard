import { getScreening } from "@/http/screening";
import type { ILevel, IQuestion, IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "./tabs/QuestionsTab";
import InterpretationsTab from "./tabs/InterpretationsTab";
import SummaryTab from "./tabs/SummaryTab";
import AnonymousScreeningSubmissionTab from "./tabs/AnonymousScreeningSubmissionTab";
import ScreeningSubmissionTab from "./tabs/ScreeningSubmissionTab";

const ScreeningDetailsPage = () => {
  const [activeTab, setActiveTab] = useSearchParams();
  const tab = activeTab.get("tab") || "details";
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
      <Tabs
        defaultValue="details"
        value={tab}
        onValueChange={(value) => {
          const searchParams = new URLSearchParams();
          searchParams.set("tab", value);
          setActiveTab(searchParams);
        }}
        className="w-full my-8"
      >
        <TabsList className="w-full">
          <TabsTrigger value="details">Screening Details</TabsTrigger>
          <TabsTrigger value="questions">Screening Questions</TabsTrigger>
          <TabsTrigger value="interpretations">Screening Interpretations</TabsTrigger>
          <TabsTrigger value="submissions">Screening Submissions</TabsTrigger>
          <TabsTrigger value="anonymous">Anonymous Screening Submissions</TabsTrigger>
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

        <TabsContent value="submissions">
          <ScreeningSubmissionTab screeningID={screening._id!} />
        </TabsContent>
        <TabsContent value="anonymous">
          <AnonymousScreeningSubmissionTab screeningID={screening._id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ScreeningDetailsPage;
