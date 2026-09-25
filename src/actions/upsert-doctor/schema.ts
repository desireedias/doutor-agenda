import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.uuid().optional(),
    clinicId: z.uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório",
    }),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().trim().min(1, {
      message: "Hora de início é obrigatória",
    }),
    availableToTime: z.string().trim().min(1, {
      message: "Hora de término é obrigatória",
    }),
  })
  .refine((data) => data.availableFromTime < data.availableToTime, {
    message: "O horário final deve ser posterior ao inicial.",
    path: ["availableToTime"],
  });

export type upsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
