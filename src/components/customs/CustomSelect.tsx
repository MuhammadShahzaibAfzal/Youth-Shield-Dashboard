import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: Option[];
  className?: string;
  placeholder?: string;
}

const CustomSelect = ({
  value,
  setValue,
  options,
  className,
  placeholder,
}: CustomSelectProps) => {
  return (
    <Select defaultValue={value} value={value} onValueChange={setValue}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default CustomSelect;
