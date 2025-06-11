import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/customs/app-sidebar";
import Header from "@/components/customs/header";
import { useAuthStore } from "@/store/authStore";

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  console.log("path name : ", location.pathname);

  if (!user) {
    return (
      <Navigate
        to={`/?returnTo=${location.pathname}${searchParams.toString()}`}
        replace
      />
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <div className="px-4 md:px-6  py-5 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};
export default DashboardLayout;
