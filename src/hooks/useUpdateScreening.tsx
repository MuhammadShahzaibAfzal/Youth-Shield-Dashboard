/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateScreening } from "@/http/screening";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateScreening = ({ screeningID }: { screeningID: string }) => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateScreening(screeningID, data);
    },
    onSuccess: () => {
      toast.success("Screening updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["screenings", screeningID] });
    },
    onError: (error: any) => {
      console.error("Error updating screening:", error);
      toast.error("Error updating screening");
    },
  });

  const handleUpdate = (data: FormData) => {
    updateMutation.mutate(data);
  };

  return { updateMutation, handleUpdate, isLoading: updateMutation.isPending };
};
export default useUpdateScreening;
