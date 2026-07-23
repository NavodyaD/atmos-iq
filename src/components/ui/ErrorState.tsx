import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
}

export function ErrorState({ 
  className, 
  title = "Something went wrong", 
  message = "Failed to load data. Please try again later.", 
  ...props 
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
