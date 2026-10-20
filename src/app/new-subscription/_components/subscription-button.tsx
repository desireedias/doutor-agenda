"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function SubscriptionButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(() => {
      router.push("/plans");
    });
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <ArrowRight
          className="order-2"
          data-icon="inline-end"
          aria-hidden="true"
        />
      )}
      Conhecer os planos
    </Button>
  );
}
