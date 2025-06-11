import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./theme-provider";

const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  return (
    <button
      className="cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <FaSun className="size-5" /> : <FaMoon className="size-5" />}
    </button>
  );
};
export default ThemeSwitcher;
