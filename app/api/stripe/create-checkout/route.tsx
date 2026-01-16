import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
    const { userEmail } = await req.json();
    const users = await db.select().from(usersTable).where(eq(usersTable.email, userEmail))

    const user = users[0]
    if (!user) {
        return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
        });

        customerId = customer.id;

        await db
            .update(usersTable)
            .set({ stripeCustomerId: customerId })
            .where(eq(usersTable.email, user.email));
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "rub",
                    product_data: {
                        name: "Analytity Premium",
                    },
                    unit_amount: 19900,
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId: String(user.id),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
}
