import { getScreening } from "@/http/screening";
import type { ILevel, IQuestion, IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import DeleteScreening from "./components/DeleteScreening";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "./tabs/QuestionsTab";
import InterpretationsTab from "./tabs/InterpretationsTab";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

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
      <Card className="flex flex-row items-center gap-4 py-0 overflow-hidden">
        <img
          src={screening.imageURL}
          alt={screening.name}
          className="w-[300px] h-[340px] object-cover"
        />
        <div className="px-4 py-4">
          <h2 className="text-xl font-semibold mb-2">{screening.name}</h2>
          <div className="space-y-2 mb-5">
            <div>
              <p className="font-semibold text-sm uppercase underline text-accent">
                Overview
              </p>
              <p className="text-muted-foreground">{screening.overview}</p>
            </div>
            <div>
              <p className="font-semibold text-sm uppercase underline text-accent">
                Purpose
              </p>
              <p className="text-muted-foreground">{screening.purpose}</p>
            </div>
            <div>
              <p className="font-semibold text-sm uppercase underline text-accent">
                Benefits
              </p>
              <ul className="list-disc list-inside">
                {screening?.benefits?.map((benefit, index) => (
                  <li key={index} className="text-muted-foreground">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/dashboard/screenings/${screening._id}/edit`}>
                <FaEdit />
              </Link>
            </Button>

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
