import { prisma } from './index';

export function startEmailCronJob() {
    console.log('[CRON] Starting background email scheduler...');

    // Run every minute (60000 ms)
    setInterval(async () => {
        try {
            const now = new Date();

            // Find campaigns that are scheduled and due
            const dueCampaigns = await prisma.emailCampaign.findMany({
                where: {
                    status: 'scheduled',
                    scheduledAt: {
                        lte: now
                    }
                },
                take: 50 // process in batches
            });

            if (dueCampaigns.length > 0) {
                console.log(`[CRON] Found ${dueCampaigns.length} scheduled emails due to send.`);

                // Pretend to send and then mark as sent
                // In reality, you'd integrate with SendGrid, AWS SES or Resend here.

                for (const campaign of dueCampaigns) {
                    // Update status to sending
                    await prisma.emailCampaign.update({
                        where: { id: campaign.id },
                        data: { status: 'sending' }
                    });

                    // Mock sending logic
                    const mockSend = new Promise((resolve) => setTimeout(resolve, 100));
                    await mockSend;

                    // Update status to sent
                    await prisma.emailCampaign.update({
                        where: { id: campaign.id },
                        data: { status: 'sent', sentAt: new Date() }
                    });
                }

                console.log(`[CRON] Successfully sent ${dueCampaigns.length} emails.`);
            }

        } catch (error) {
            console.error('[CRON] Error in email scheduling job:', error);
        }
    }, 60000); // 60 seconds
}
