import { LucideX } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

type QuizSectionFormProps = {
  index: number;
};

export function QuizSectionForm({ index }: QuizSectionFormProps) {
  const { control } = useFormContext();
  const options = useFieldArray({
    control: control,
    name: `sections.${index}.quizAnswers`,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {options.fields.map((field, optionIndex) => (
          <div className="space-y-6" key={field.id}>
            <div className="flex items-center space-x-6">
              <FormField
                control={control}
                name={`sections.${index}.quizAnswers.${optionIndex}.answer`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => options.remove(optionIndex)}
              >
                <LucideX className="h-4 w-4" />
              </Button>
            </div>

            <FormField
              control={control}
              name={`sections.${index}.quizAnswers.${optionIndex}.isCorrect`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is correct</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          className="my-6 w-full"
          onClick={() =>
            options.append({
              answer: "",
              isCorrect: false,
            })
          }
        >
          Add option
        </Button>
      </CardContent>
    </Card>
  );
}
