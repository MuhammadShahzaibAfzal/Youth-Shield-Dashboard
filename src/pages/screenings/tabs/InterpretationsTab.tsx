import CustomJoditEditor from "@/components/customs/CustomJoditEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdateScreening from "@/hooks/useUpdateScreening";
import type { ILevel, IScreening } from "@/types";
import { Loader2 } from "lucide-react";
import { FaPlus, FaSave } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const InterpretationsTab = ({
  interpretations,
  setInterpretations,
  screening,
}: {
  interpretations: ILevel[];
  setInterpretations: React.Dispatch<React.SetStateAction<ILevel[]>>;
  screening: IScreening;
}) => {
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
    <div>
      <div className="flex mt-4 justify-between items-center gap-4">
        <div>
          <h2 className="mt-4 mb-2 uppercase text-xl font-semibold">Interpretations</h2>
          {interpretations?.length === 0 && (
            <p className="text-muted-foreground">No interpretations added yet. </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 my-4">
        {interpretations?.map((level) => (
          <div className="flex flex-col  border p-4 rounded-md gap-4">
            <div className="flex gap-4 flex-1">
              <div>
                <Label>Score</Label>
                <Input
                  className="w-32"
                  value={level.from}
                  onChange={(e) => handleLevelChange(level._id, "from", e.target.value)}
                />
              </div>
              <div className="self-end">
                <Input
                  className="w-32"
                  value={level.to}
                  onChange={(e) => handleLevelChange(level._id, "to", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>Level</Label>
                <Input
                  value={level.name}
                  onChange={(e) => handleLevelChange(level._id, "name", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex-1">
              <Label>Proposed Solution</Label>
              <CustomJoditEditor
                content={level.proposedSolution}
                setContent={(content: string) =>
                  handleLevelChange(level._id, "proposedSolution", content)
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
    </div>
  );
};
export default InterpretationsTab;
