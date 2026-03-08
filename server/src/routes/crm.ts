import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// In a real app, userId should come from auth middleware
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// GET /api/crm/leads
router.get('/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            where: { userId: DUMMY_USER_ID },
            include: { buyer: true }
        });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// POST /api/crm/leads
router.post('/leads', async (req, res) => {
    try {
        const { buyerId, status, dealValue } = req.body;

        // Check if user exists, if not create a dummy one for MVP
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

        const lead = await prisma.lead.create({
            data: {
                userId: user.id,
                buyerId,
                status: status || 'New Lead',
                dealValue: dealValue || 0,
            }
        });

        res.json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// PUT /api/crm/leads/:id/status
router.put('/leads/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await prisma.lead.update({
            where: { id },
            data: { status }
        });

        res.json(lead);
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ error: 'Failed to update lead status' });
    }
});

export default router;
