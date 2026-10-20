import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import { SubscriptionPlan } from "../(protected)/subscription/_components/subscription-plan";

export default async function PlansPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center px-6 py-8 sm:py-12">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="text-center">
          <Button
            nativeButton={false}
            variant="ghost"
            render={<a href="/new-subscription" />}
          >
            Voltar para os primeiros passos
          </Button>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Planos</h1>
          <p className="text-muted-foreground mt-2">
            Escolha o plano ideal para começar a organizar sua clínica.
          </p>
        </div>
        <SubscriptionPlan userEmail={session.user.email} />
      </div>
    </main>
  );
}
