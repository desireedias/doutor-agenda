"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const createStripeCheckout = actionClient.action(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Sem autorização");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret Key não encontrada");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-09-30.endive",
    });
    const { url } = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
      line_items: [
        {
          price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
    });
    return {
      url,
    };
  } catch (error) {
    console.error("ERRO NA ACTION:", error);
    throw error;
  }
});
