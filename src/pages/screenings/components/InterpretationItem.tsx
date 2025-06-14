import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdateScreening from "@/hooks/useUpdateScreening";
import type { ILevel, IScreening } from "@/types";
import { Loader2 } from "lucide-react";
import { FaPlus, FaSave } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  interpretation: ILevel;
  setInterpretations: React.Dispatch<React.SetStateAction<ILevel[]>>;
  screening: IScreening;
  interpretations: ILevel[];
}

const InterpretationItem = ({
  setInterpretations,
  screening,
  interpretations,
}: IProps) => {
  const { isLoading, handleUpdate } = useUpdateScreening({
    screeningID: screening._id as string,
  });

  const handleAddLevel = () => {
    const id = uuidv4();
    setInterpretations((prevInterpretations) => [
      ...prevInterpretations,
      { _id: id, name: "", proposedSolution: "", from: 0, to: 0 },
    ]);
  };

  const handleLevelChange = (id: string, field: string, value: string) => {
    setInterpretations((prevInterpretations) => {
      const updatedInterpretations = prevInterpretations.map((level) => {
        if (level._id === id) {
          return {
            ...level,
            [field]: value,
          };
        }
        return level;
      });
      return updatedInterpretations;
    });
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("interpretations", JSON.stringify(interpretations));
    handleUpdate(formData);
  };

  return (
    <div className="border bg-secondary space-y-7 border-t-0 p-4">
      {interpretations?.map((level) => (
        <div className="flex gap-4">
          <div>
            <Label>From</Label>
            <Input
              className="w-20"
              value={level.from}
              onChange={(e) => handleLevelChange(level._id, "from", e.target.value)}
            />
          </div>
          <div>
            <Label>To</Label>
            <Input
              className="w-20"
              value={level.to}
              onChange={(e) => handleLevelChange(level._id, "to", e.target.value)}
            />
          </div>
          <div>
            <Label>Level</Label>
            <Input
              value={level.name}
              onChange={(e) => handleLevelChange(level._id, "name", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label>Proposed Solution</Label>
            <Input
              value={level.proposedSolution}
              onChange={(e) =>
                handleLevelChange(level._id, "proposedSolution", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <div className="flex gap-6 justify-end">
        <Button variant="outline" onClick={handleAddLevel}>
          <FaPlus /> Add Level
        </Button>
        <Button onClick={handleSave}>
          {isLoading ? <Loader2 className="animate-spin" /> : <FaSave />} Save
        </Button>
      </div>
    </div>
  );
};
export default InterpretationItem;
