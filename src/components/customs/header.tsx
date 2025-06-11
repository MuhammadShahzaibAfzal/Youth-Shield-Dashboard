import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeSwitcher from "./theme-switcher";
import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { avatar } from "@/assets";

const Header = () => {
  const { handleLogout, user } = useLogout();
  const navigate = useNavigate();
  return (
    <header className="flex h-18 px-4 md:px-6  w-full border-b border-sidebar-border justify-between items-center">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <h1 className="text-lg font-medium">Dashboard</h1>
      </div>
      <div className="flex gap-2 items-center">
        <p className="text-sm">
          Hello,{" "}
          <span className="font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </p>
        <DropdownMenu dir="ltr">
          <DropdownMenuTrigger className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
            <Avatar>
              <AvatarImage src={avatar} alt="@shadcn" />
              <AvatarFallback>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuItem
              onClick={() => {
                navigate("/dashboard/profile");
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitcher />
      </div>
    </header>
  );
};
export default Header;
