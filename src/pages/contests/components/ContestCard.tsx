import { Card } from "@/components/ui/card";
import type { IContest } from "@/types";
import { format } from "date-fns";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const ContestCard = ({ contest }: { contest: IContest }) => {
  return (
    <Card className="flex p-0 pb-4 flex-col overflow-hidden justify-between hover:shadow-lg">
      <Link to={`/dashboard/contests/${contest._id}`}>
        <img
          src={contest.imageURL}
          alt={contest.name}
          className="w-full h-[200px] overflow-hidden object-cover"
        />
        <div className="px-4 mt-4">
          <h2 className="text-lg font-semibold">{contest.name}</h2>
          <div className="flex gap-3 mt-3 items-center">
            <FaClock />
            <span className="text-sm text-muted-foreground">
              {format(contest.fromDate, "dd MMM yyyy")}, {contest.fromTime} -{" "}
              {format(contest.toDate, "dd MMM yyyy")}, {contest.toTime}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
};
export default ContestCard;
