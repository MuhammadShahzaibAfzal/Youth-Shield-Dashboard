import Loader from "@/components/customs/loader";
import { self } from "@/http/auth";
import { useAuthStore } from "@/store/authStore";
import type { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";

const RootLayout = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: self,
    retry: 0,
    refetchOnWindowFocus: false,
  });
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (data) {
      const user = data.data.user as IUser;
      setUser(user);
      if (location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      }
    }
  }, [data]);

  if (isLoading) {
    return <Loader className="h-screen" />;
  }
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
};
export default RootLayout;
