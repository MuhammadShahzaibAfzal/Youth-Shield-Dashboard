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
import ScreeningsPage from "./pages/screenings/ScreeningsPage";
import ScreeningDetailsPage from "./pages/screenings/ScreeningDetailsPage";
import ContestsPage from "./pages/contests/ContestsPage";
import ContestDetailsPage from "./pages/contests/ContestDetailsPage";
import EventsManagement from "./pages/events/EventsManagement";
import AddEvent from "./pages/events/AddEvent";
import UpdateEvent from "./pages/events/UpdateEvent";
import EventRegistrations from "./pages/events/EventRegistrations";
import AddScreening from "./pages/screenings/components/AddScreening";
import UpdateScreening from "./pages/screenings/components/UpdateScreening";
import ResourcesMangement from "./pages/resources/ResourcesMangement";
import IndependentResourcesMangement from "./pages/independent-research/IndependentResearch";
import Schools from "./pages/schools/Schools";

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
            path: "events-management",
            element: <EventsManagement />,
          },
          {
            path: "events-management/add",
            element: <AddEvent />,
          },
          {
            path: "events-management/update/:id",
            element: <UpdateEvent />,
          },

          {
            path: "events-management/registrations/:id",
            element: <EventRegistrations />,
          },

          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "category-management",
            element: <CategoryPage />,
          },
          {
            path: "screenings",
            element: <ScreeningsPage />,
          },
          {
            path: "screenings/add",
            element: <AddScreening />,
          },
          // /dashboard/screenings/${screening._id}/edit
          {
            path: "screenings/:id/edit",
            element: <UpdateScreening />,
          },
          {
            path: "screenings/:id",
            element: <ScreeningDetailsPage />,
          },

          {
            path: "contests",
            element: <ContestsPage />,
          },
          {
            path: "contests/:id",
            element: <ContestDetailsPage />,
          },
          {
            path: "resources-management",
            element: <ResourcesMangement />,
          },
          {
            path: "independent-research",
            element: <IndependentResourcesMangement />,
          },
          {
            path: "schools",
            element: <Schools />,
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
