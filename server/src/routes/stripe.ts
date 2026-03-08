import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../index';
import bodyParser from 'body-parser';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover'
});

// Mock user ID since auth is not fully implemented yet
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// POST /api/stripe/create-checkout
router.post('/create-checkout', async (req, res) => {
    try {
        const { priceId } = req.body;

        // Ensure user exists for the mock setup
        let user = await prisma.user.findUnique({ where: { id: DUMMY_USER_ID } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: DUMMY_USER_ID,
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123"
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // Redirects to frontend
            success_url: 'http://localhost:3000/dashboard?success=true',
            cancel_url: 'http://localhost:3000/dashboard/pricing',
            metadata: {
                userId: user.id
            }
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
});

// POST /api/stripe/webhook
// Needs raw body for signature verification
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId) {
            // Determine the plan basically by just assuming Growth for this demo 
            // In a real app we would map the priceId to the plan name
            let mappedPlan = "growth";
            try {
                // Let's do a basic mapping by inspecting line items if they were expanded, or just default to growth
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                // We'd map lineItems.data[0].price.id to starter/growth/professional
                // For now, we'll set a default value or mock it.
            } catch (e) { }

            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        subscriptionPlan: 'professional', // Upgraded
                        stripeCustomerId: customerId,
                        stripeSubscriptionId: subscriptionId
                    }
                });
                console.log(`Successfully upgraded user ${userId} to professional plan.`);
            } catch (error) {
                console.error('Error updating user subscription:', error);
            }
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

export default router;
