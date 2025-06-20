import { Card } from "@/components/ui/card";
import { getContest } from "@/http/contest";
import type { IContest, IContestQuestion } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UpdateContest from "./components/UpdateContest";
import DeleteContest from "./components/DeleteContest";
import { FaClock } from "react-icons/fa";
import { format } from "date-fns";
import ContestQuestions from "./components/ContestQuestions";

const ContestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<IContestQuestion[]>([]);
  const { data: contest, isLoading } = useQuery<IContest>({
    queryKey: ["contests", id],
    queryFn: () => getContest(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!contest) return;
    setQuestions(contest?.questions || []);
  }, [contest]);

  if (isLoading) return <div>Loading...</div>;

  if (!contest) return <div>Contest not found</div>;
  return (
    <div>
      <Card className="flex flex-row items-center gap-4 py-0 overflow-hidden">
        <img
          src={contest.imageURL}
          alt={contest.name}
          className="h-[250px] object-cover"
        />
        <div className="px-4 py-4">
          <h2 className="text-xl font-semibold mb-2">{contest.name}</h2>
          <div className="flex gap-3 mb-4 items-center">
            <FaClock />
            <span className="text-sm text-muted-foreground">
              {format(contest.fromDate, "dd MMM yyyy")}, {contest.fromTime} -{" "}
              {format(contest.toDate, "dd MMM yyyy")}, {contest.toTime}
            </span>
          </div>
          <p className="text-muted-foreground">{contest.description}</p>
          <div className="flex justify-start gap-4 mt-4">
            <UpdateContest contest={contest} />
            <DeleteContest contest={contest} />
          </div>
        </div>
      </Card>

      <ContestQuestions
        questions={questions}
        setQuestions={setQuestions}
        contest={contest}
      />
    </div>
  );
};
export default ContestDetailsPage;
