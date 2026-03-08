import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    const buyerCount = await prisma.buyer.count();
    const sellerCount = await prisma.seller.count();
    console.log('Buyers:', buyerCount);
    console.log('Sellers:', sellerCount);

    const sampleBuyer = await prisma.buyer.findFirst({
        where: { companyName: { not: 'Unknown Company' } }
    });
    console.log('Sample Buyer:', sampleBuyer?.companyName);
}

verify().finally(() => prisma.$disconnect());
