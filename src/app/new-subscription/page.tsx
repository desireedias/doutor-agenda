import { ArrowRight, Check, ClipboardList, Stethoscope } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

const steps = [
  {
    title: "Criar sua conta",
    description: "Cadastro realizado com sucesso.",
    complete: true,
  },
  {
    title: "Escolher seu plano",
    description: "Encontre a opção ideal para sua clínica.",
    complete: false,
  },
  {
    title: "Configurar sua clínica",
    description: "Adicione as informações básicas do seu negócio.",
    complete: false,
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">Doutor-Agenda</p>
            <p className="text-sm text-muted-foreground">Gestão de clínicas simplificada</p>
          </div>
        </header>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit gap-2 px-3 py-1">
                <ClipboardList className="size-3.5" aria-hidden="true" />
                Primeiros passos
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Sua clínica começa aqui.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Sua conta está criada. Vamos preparar tudo para você começar a organizar sua clínica em um só lugar.
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">Seu progresso</h2>
                    <p className="text-sm text-muted-foreground">Uma etapa de três concluída</p>
                  </div>
                  <span className="text-sm font-medium text-primary">33%</span>
                </div>
                <div className="flex flex-col gap-5">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground">
                          {step.complete ? <Check className="size-4" aria-hidden="true" /> : <span className="text-sm">{index + 1}</span>}
                        </div>
                        {index < steps.length - 1 ? <Separator orientation="vertical" className="min-h-6" /> : null}
                      </div>
                      <div className="flex flex-col gap-1 pb-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" size="lg" render={<a href="/plans" />}>
                  Conhecer os planos
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground">
          Precisa de ajuda? <a className="font-medium text-primary hover:underline" href="mailto:suporte@doutor-agenda.com">Entre em contato com nosso suporte.</a>
        </footer>
      </div>
    </main>
  );
}
