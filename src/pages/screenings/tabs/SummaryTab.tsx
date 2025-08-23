import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { Check } from "lucide-react";
import DeleteScreening from "../components/DeleteScreening";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { IScreening } from "@/types";
const SummaryTab = ({ screening }: { screening: IScreening }) => {
  return (
    <div className="mt-4">
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
              <p className="font-semibold mb-1 text-sm   text-accent">Overview</p>
              <p className="text-muted-foreground ml-2">{screening.overview}</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-sm   text-accent">Purpose</p>
              <p className="text-muted-foreground ml-2">{screening.purpose}</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-sm   text-accent">Benefits</p>
              <ul className="ml-2">
                {screening?.benefits?.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex gap-2 items-center"
                  >
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{benefit}</span>
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
    </div>
  );
};
export default SummaryTab;
