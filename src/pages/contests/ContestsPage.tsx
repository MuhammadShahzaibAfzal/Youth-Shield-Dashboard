import { getContests } from "@/http/contest";
import type { IContest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import AddContest from "./components/AddContest";
import ContestCard from "./components/ContestCard";

const ContestsPage = () => {
  const { data, isLoading } = useQuery<{
    contests: IContest[];
    total: number;
  }>({
    queryKey: ["contests"],
    queryFn: async () => {
      return getContests();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Contests</h1>
          <p className="text-gray-600">Manage all available contests</p>
        </div>
        <AddContest />
      </div>

      {data?.contests?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No contests available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {data?.contests?.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestsPage;
