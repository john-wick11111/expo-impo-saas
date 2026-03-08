import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// GET /api/email-sequences
router.get('/', async (req, res) => {
    try {
        const sequences = await prisma.emailSequence.findMany({
            where: { userId: DUMMY_USER_ID },
            include: {
                steps: true,
                campaigns: {
                    select: { status: true, opened: true, replied: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const sequencesWithMetrics = sequences.map(seq => {
            let sent = 0, opened = 0, replied = 0;
            seq.campaigns.forEach(camp => {
                if (camp.status === 'sent') sent++;
                if (camp.opened) opened++;
                if (camp.replied) replied++;
            });
            const { campaigns, ...rest } = seq;
            return { ...rest, metrics: { sent, opened, replied } };
        });

        res.json(sequencesWithMetrics);
    } catch (error) {
        console.error('Error fetching email sequences:', error);
        res.status(500).json({ error: 'Failed to fetch email sequences' });
    }
});

// GET /api/email-sequences/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sequence = await prisma.emailSequence.findUnique({
            where: { id },
            include: { steps: { orderBy: { stepOrder: 'asc' } } }
        });

        if (!sequence) {
            return res.status(404).json({ error: 'Sequence not found' });
        }

        res.json(sequence);
    } catch (error) {
        console.error('Error fetching email sequence:', error);
        res.status(500).json({ error: 'Failed to fetch email sequence' });
    }
});

// POST /api/email-sequences
router.post('/', async (req, res) => {
    try {
        const { name, steps } = req.body;

        if (!name || !steps || !Array.isArray(steps)) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const sequence = await prisma.emailSequence.create({
            data: {
                name,
                userId: DUMMY_USER_ID,
                steps: {
                    create: steps.map((step: any, index: number) => ({
                        subject: step.subject,
                        body: step.body,
                        delayDays: step.delayDays,
                        stepOrder: index + 1
                    }))
                }
            },
            include: { steps: true }
        });

        res.json(sequence);
    } catch (error) {
        console.error('Error creating email sequence:', error);
        res.status(500).json({ error: 'Failed to create email sequence' });
    }
});

// PUT /api/email-sequences/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, steps } = req.body;

        // Easiest update for steps: delete existing and recreate
        await prisma.emailSequenceStep.deleteMany({
            where: { sequenceId: id }
        });

        const sequence = await prisma.emailSequence.update({
            where: { id },
            data: {
                name,
                steps: {
                    create: steps.map((step: any, index: number) => ({
                        subject: step.subject,
                        body: step.body,
                        delayDays: step.delayDays,
                        stepOrder: index + 1
                    }))
                }
            },
            include: { steps: true }
        });

        res.json(sequence);
    } catch (error) {
        console.error('Error updating email sequence:', error);
        res.status(500).json({ error: 'Failed to update email sequence' });
    }
});

// DELETE /api/email-sequences/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // cascade deletion should handle steps, but we might need to delete manually if relation isn't cascaded
        await prisma.emailSequenceStep.deleteMany({ where: { sequenceId: id } });
        await prisma.emailSequence.delete({ where: { id } });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting email sequence:', error);
        res.status(500).json({ error: 'Failed to delete email sequence' });
    }
});

// POST /api/email-sequences/start
router.post('/start', async (req, res) => {
    try {
        const { sequenceId, buyerIds } = req.body;

        if (!sequenceId || !buyerIds || !Array.isArray(buyerIds) || buyerIds.length === 0) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const sequence = await prisma.emailSequence.findUnique({
            where: { id: sequenceId },
            include: { steps: { orderBy: { stepOrder: 'asc' } } }
        });

        if (!sequence) {
            return res.status(404).json({ error: 'Sequence not found' });
        }

        if (sequence.steps.length === 0) {
            return res.status(400).json({ error: 'Sequence has no steps' });
        }

        const now = new Date();

        // For each buyer, schedule the emails
        // We do this in a single transaction or Promise.all chunk
        const campaignsToCreate: any[] = [];

        for (const buyerId of buyerIds) {
            for (const step of sequence.steps) {
                const scheduledDate = new Date(now.getTime());
                scheduledDate.setDate(scheduledDate.getDate() + step.delayDays);

                campaignsToCreate.push({
                    userId: DUMMY_USER_ID,
                    buyerId,
                    sequenceId: sequence.id,
                    sequenceStepId: step.id,
                    emailSubject: step.subject,
                    emailBody: step.body,
                    status: 'scheduled',
                    scheduledAt: scheduledDate
                });
            }
        }

        await prisma.emailCampaign.createMany({
            data: campaignsToCreate
        });

        res.json({ message: 'Sequence started successfully', campaignsCreated: campaignsToCreate.length });

    } catch (error) {
        console.error('Error starting email sequence:', error);
        res.status(500).json({ error: 'Failed to start email sequence' });
    }
});

export default router;
