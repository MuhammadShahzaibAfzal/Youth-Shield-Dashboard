import { Card } from "@/components/ui/card";
import type { IScreening } from "@/types";
import { Link } from "react-router-dom";

const ScreeningCard = ({ screening }: { screening: IScreening }) => {
  return (
    <Card className="flex p-0 pb-4 flex-col overflow-hidden justify-between hover:shadow-lg">
      <Link to={`/dashboard/screenings/${screening._id}`}>
        <img
          src={screening.imageURL}
          alt={screening.name}
          className="w-full h-[200px] overflow-hidden object-cover"
        />
        <div className="px-4 mt-4">
          <h2 className="text-lg font-semibold">{screening.name}</h2>
        </div>
      </Link>
    </Card>
  );
};
export default ScreeningCard;
