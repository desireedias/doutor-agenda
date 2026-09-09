"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

//sintaxe para inserir um registro em uma tabela no drizzle

export const createClinic = async (name: string) => {
  //preciso verificar se o  usuario esta logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Sem autorização");
  }
  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
  redirect("/dashboard");
};
