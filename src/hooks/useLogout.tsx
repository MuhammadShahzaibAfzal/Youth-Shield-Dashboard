import { logout } from "@/http/auth";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogout = () => {
  const { logout: logoutFromStore, user } = useAuthStore();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return logout();
    },
    onSuccess: () => {
      logoutFromStore();
    },
    onError: (error) => {
      const { message, type } = getErrorMessage(error);
      toast(message, { description: type });
    },
  });
  const handleLogout = () => {
    mutation.mutate();
  };
  return { handleLogout, user };
};
export default useLogout;
