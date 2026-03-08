import { PrismaClient } from '@prisma/client';
import { calculateVerificationScore } from '../src/utils/verificationScore';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting verification score update...');

    // Fetch all buyers
    const buyers = await prisma.buyer.findMany();
    console.log(`Found ${buyers.length} buyers to process.`);

    let updatedCount = 0;

    for (const buyer of buyers) {
        const scoreData = {
            email: buyer.email,
            emailVerified: buyer.emailVerified,
            website: buyer.website,
            websiteActive: buyer.websiteActive,
            linkedin: buyer.linkedin
        };

        const calculatedScore = calculateVerificationScore(scoreData);

        // Update if the score differs or if it's the first time
        if (buyer.verificationScore !== calculatedScore) {
            await prisma.buyer.update({
                where: { id: buyer.id },
                data: { verificationScore: calculatedScore }
            });
            updatedCount++;
        }
    }

    console.log(`Successfully updated scores for ${updatedCount} buyers.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
