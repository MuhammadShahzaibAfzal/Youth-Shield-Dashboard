/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateContest } from "@/http/contest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateContest = ({ contestID }: { contestID: string }) => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateContest(contestID, data);
    },
    onSuccess: () => {
      toast.success("Contest updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["contests", contestID] });
    },
    onError: (error: any) => {
      console.error("Error updating contest:", error);
      toast.error("Error updating contest");
    },
  });

  const handleUpdate = (data: FormData) => {
    updateMutation.mutate(data);
  };

  return { updateMutation, handleUpdate, isLoading: updateMutation.isPending };
};
export default useUpdateContest;
