import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IScreening } from "@/types";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import DeleteScreening from "./DeleteScreening";
import UpdateScreening from "./UpdateScreening";

const ScreeningCard = ({ screening }: { screening: IScreening }) => {
  return (
    <Card className="flex p-0 pb-4 flex-col overflow-hidden justify-between hover:shadow-lg">
      <img
        src={screening.imageURL}
        alt={screening.name}
        className="w-full h-[200px] overflow-hidden object-cover"
      />
      <div className="px-4 pt-4">
        <h2 className="text-lg font-semibold mb-2">{screening.name}</h2>
        <div className="flex justify-start gap-4 mt-4">
          <UpdateScreening screening={screening} />
          <Button size="icon" asChild>
            <Link to={`/dashboard/screenings/${screening._id}`}>
              <FaEye className="size-4.5" />
            </Link>
          </Button>
          <DeleteScreening screening={screening} />
        </div>
      </div>
    </Card>
  );
};
export default ScreeningCard;
