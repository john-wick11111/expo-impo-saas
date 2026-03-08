import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// POST /api/email/send
router.post('/send', async (req, res) => {
    try {
        const { subject, body, targetIndustry } = req.body;

        // Simulate sending emails to matching buyers
        const buyers = await prisma.buyer.findMany({
            where: targetIndustry === 'all' ? {} : {
                industry: {
                    contains: String(targetIndustry),
                    mode: 'insensitive'
                }
            }
        });

        const campaign = await prisma.emailCampaign.create({
            data: {
                userId: DUMMY_USER_ID,
                buyerId: buyers.length > 0 ? buyers[0].id : DUMMY_USER_ID, // Link to first buyer for MVP tracing
                emailSubject: subject,
                emailBody: body,
                status: 'sending'
            }
        });

        // Mock completing the send process
        setTimeout(async () => {
            await prisma.emailCampaign.update({
                where: { id: campaign.id },
                data: { status: 'sent' }
            });
        }, 2000);

        res.json({ message: 'Campaign queued', campaignId: campaign.id, recipientsCount: buyers.length });
    } catch (error) {
        console.error('Error sending campaign:', error);
        res.status(500).json({ error: 'Failed to send email campaign' });
    }
});

// GET /api/email/campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await prisma.emailCampaign.findMany({
            where: { userId: DUMMY_USER_ID },
            orderBy: { sentAt: 'desc' }
        });
        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

export default router;
