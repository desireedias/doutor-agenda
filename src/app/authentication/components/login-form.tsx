"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "E-mail obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("E-mail ou senha inválidos");
        },
      },
    );
  }

  return (
    <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full space-y-4">
        <CardHeader>
          <CardTitle>Faça Login</CardTitle>

          <CardDescription>
            Digite o e-mail abaixo para acessar sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6 space-y-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                  <a
                    href="#"
                    className="mr-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>

          <Button variant="outline" className="w-full">
            Login com Google
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
