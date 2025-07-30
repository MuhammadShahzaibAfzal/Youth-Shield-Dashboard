import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { JSX } from "react";
import {
  FaSearch,
  FaProjectDiagram,
  FaChartBar,
  FaChartPie,
  FaBiohazard,
  FaDatabase,
  FaBookOpen,
  FaTools,
  FaFileAlt,
  FaFlask,
  FaMicrochip,
  FaRobot,
} from "react-icons/fa";

export const iconMap: Record<string, JSX.Element> = {
  Research: <FaSearch className="text-black" />,
  Methodology: <FaProjectDiagram className="text-black" />,
  Analytics: <FaChartBar className="text-black" />,
  Statistics: <FaChartPie className="text-black" />,
  LabSafety: <FaBiohazard className="text-black" />,
  Data: <FaDatabase className="text-black" />,
  Education: <FaBookOpen className="text-black" />,
  Tools: <FaTools className="text-black" />,
  Report: <FaFileAlt className="text-black" />,
  Experiment: <FaFlask className="text-black" />,
  Technology: <FaMicrochip className="text-black" />,
  MachineLearning: <FaRobot className="text-black" />,
};

interface IconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  setSelectedIcon,
}) => {
  return (
    <Select onValueChange={(value) => setSelectedIcon(value)}>
      <SelectTrigger className="w-full">
        {selectedIcon ? (
          <div className="flex items-center space-x-2">
            {iconMap[selectedIcon as keyof typeof iconMap]}
            {/* <span>{selectedIcon}</span> */}
          </div>
        ) : (
          "Select an icon"
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.keys(iconMap).map((icon) => (
          <SelectItem key={icon} value={icon}>
            <div className="flex  items-center space-x-2">
              {iconMap[icon as keyof typeof iconMap]}
              {/* <span>{icon}</span> */}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IconSelector;
