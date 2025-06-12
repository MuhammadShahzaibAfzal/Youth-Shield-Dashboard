import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Model({
  children,
  title,
  description,
  buttonText,
  onClick,
  className,
  btnClassName,
  isOpen,
  setIsOpen,
  isLoading,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
  className?: string;
  btnClassName?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button disabled={isLoading} className={btnClassName} onClick={onClick}>
            {buttonText} {isLoading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
