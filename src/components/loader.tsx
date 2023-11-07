import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </div>
  );
}
