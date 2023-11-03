import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as _useForm, type UseFormProps } from "react-hook-form";
import { type TypeOf, type ZodSchema } from "zod";

type UseZodFormProps<T extends ZodSchema> = UseFormProps<TypeOf<T>> & {
  schema: T;
};

/** Wrapper of `react-hook-form` hook `useForm` with `zod` as validator */
export function useForm<T extends ZodSchema>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) {
  return _useForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
}
