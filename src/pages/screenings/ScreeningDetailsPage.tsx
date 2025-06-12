import { getScreening } from "@/http/screening";
import type { IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UpdateScreening from "./components/UpdateScreening";
import DeleteScreening from "./components/DeleteScreening";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ScreeningDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: screening, isLoading } = useQuery<IScreening>({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id!),
    enabled: !!id,
  });

  console.log("screening", screening);

  if (isLoading) return <div>Loading...</div>;

  if (!screening) return <div>Screening not found</div>;

  return (
    <div>
      <Card className="flex flex-row items-center gap-4">
        <img
          src={screening.imageURL}
          alt={screening.name}
          className="w-[250px] h-[200px] object-contain"
        />
        <div className="px-4 pt-4">
          <h2 className="text-xl font-semibold mb-2">{screening.name}</h2>
          <p className="text-muted-foreground">{screening.description}</p>
          <div className="flex justify-start gap-4 mt-4">
            <UpdateScreening screening={screening} />
            <DeleteScreening screening={screening} />
          </div>
        </div>
      </Card>
      <h2 className="mt-4 mb-2 uppercase text-xl font-semibold">Questions</h2>

      <Accordion className="w-full space-y-3" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="border">How old are you?</AccordionTrigger>
          <AccordionContent>
            <p>Answer 1</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="border">
            Are you a man or a woman?
          </AccordionTrigger>
          <AccordionContent>
            <p>Answer 2</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="border">
            Are you a man or a woman?
          </AccordionTrigger>
          <AccordionContent>
            <p>Answer 2</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="border">
            Are you a man or a woman?
          </AccordionTrigger>
          <AccordionContent>
            <p>Answer 2</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default ScreeningDetailsPage;
