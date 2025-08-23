import { logo, logoWhite } from "@/assets";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdLogout,
  MdAssignment,
} from "react-icons/md";
import { GiMaterialsScience } from "react-icons/gi";

import {
  FaBookOpen,
  FaCalendarCheck,
  FaNewspaper,
  FaRegUser,
  FaSchool,
  FaTrophy,
} from "react-icons/fa";
import { useTheme } from "./theme-provider";
import useLogout from "@/hooks/useLogout";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    title: "Health Screenings",
    url: "/dashboard/screenings",
    icon: MdAssignment,
  },
  {
    title: "Contests Management",
    url: "/dashboard/contests",
    icon: FaTrophy,
  },
  {
    title: "News Management",
    url: "/dashboard/news-management",
    icon: FaNewspaper,
  },
  {
    title: "News Category Management",
    url: "/dashboard/category-management",
    icon: MdOutlineCategory,
  },
  {
    title: "Events Management",
    url: "/dashboard/events-management",
    icon: FaCalendarCheck,
  },
  {
    title: "Resources Management",
    url: "/dashboard/resources-management",
    icon: FaBookOpen,
  },

  {
    title: "Independent Research Management",
    url: "/dashboard/independent-research",
    icon: GiMaterialsScience,
  },

  {
    title: "Schools Management",
    url: "/dashboard/schools",
    icon: FaSchool,
  },

  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: FaRegUser,
  },
  {
    title: "Logout",
    url: "/dashboard/logout",
    icon: MdLogout,
  },
];

export function AppSidebar() {
  const { theme } = useTheme();
  const { handleLogout } = useLogout();

  return (
    <Sidebar className="custom-sidebar">
      <SidebarHeader className="">
        <img
          src={theme === "dark" ? logoWhite : logo}
          className="w-32 object-contain mx-auto mb-4 mt-2"
          alt="Logo"
        />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto mt-4 px-3">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="px-3 hover:bg-secondary hover:text-secondary-foreground"
                asChild
              >
                {item.title === "Logout" ? (
                  <button onClick={handleLogout} className="cursor-pointer">
                    <span>
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <NavLink to={item.url} end={item.url === "/dashboard"}>
                    <span>
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
