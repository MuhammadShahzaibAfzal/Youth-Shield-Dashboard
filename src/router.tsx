import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import DashboardLayout from "./layouts/DashboardLayout";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/forgot-password/ForgotPasswordPage";
import CategoryPage from "./pages/category/CategoryPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NewsManagement from "./pages/news/NewsManagement";
import AddNews from "./pages/news/AddNews";
import UpdateNews from "./pages/news/UpdateNews";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "news-management",
            element: <NewsManagement />,
          },
          {
            path: "news-management/add",
            element: <AddNews />,
          },
          {
            path: "news-management/update/:id",
            element: <UpdateNews />,
          },

          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "category-management",
            element: <CategoryPage />,
          },
        ],
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

export default router;
