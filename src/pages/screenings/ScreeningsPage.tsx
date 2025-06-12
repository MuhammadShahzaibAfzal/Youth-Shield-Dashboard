import { getScreenings } from "@/http/screening";
import type { IScreening } from "@/types";
import { useQuery } from "@tanstack/react-query";
import AddScreening from "./components/AddScreening";
import ScreeningCard from "./components/ScreeningCard";

const ScreeningsPage = () => {
  const { data, isLoading } = useQuery<{
    screenings: IScreening[];
  }>({
    queryKey: ["screenings"],
    queryFn: async () => {
      return getScreenings();
    },
  });
  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Health Screenings</h1>
          <p>Manage your health screenings</p>
        </div>
        <AddScreening />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.screenings?.map((screening) => {
          return <ScreeningCard key={screening._id} screening={screening} />;
        })}
      </div>
    </div>
  );
};
export default ScreeningsPage;
