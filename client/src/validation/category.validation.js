import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup
    .string()
    .transform((value) => value?.trim()) 
    .min(2, "Too short")
    .max(50, "Too long")
    .required("Category name is required"),
});
