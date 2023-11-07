import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface ErrorProps {
  title: string;
  description: string;
}

export function Error({ title, description }: ErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
