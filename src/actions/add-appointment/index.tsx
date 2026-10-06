"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { addAppointmentSchema } from "./schema";

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Não autorizado");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clínica não encontrada");
    }

    const appointmetDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db
      .insert(appointmentsTable)
      .values({
        ...parsedInput,
        id: parsedInput.doctorId,
        clinicId: session?.user.clinic?.id,
        date: appointmetDateTime,
      })
      .onConflictDoUpdate({
        target: [appointmentsTable.id],
        set: {
          ...parsedInput,
          date: appointmetDateTime,
        },
      });
    revalidatePath("/appointments");
  });
