import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  email: z
    .string()
    .trim()
    .min(1, { message: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  phoneNumber: z.string().trim().min(1, {
    message: "Número de telefone é obrigatório",
  }),
  sex: z.enum(["male", "female"], {
    message: "Sexo é obrigatório",
  }),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
