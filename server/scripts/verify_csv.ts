import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const rawBuyers = await prisma.buyer.count({ where: { industry: 'Agriculture' } });
    const rawSellers = await prisma.seller.count({ where: { industry: 'Agriculture' } });
    console.log(`Verified CSV Buyers via Prisma: ${rawBuyers}`);
    console.log(`Verified CSV Sellers via Prisma: ${rawSellers}`);

    const samples = await prisma.buyer.findMany({ where: { industry: 'Agriculture' }, take: 3 });
    console.log(JSON.stringify(samples, null, 2));

    await prisma.$disconnect();
}
check();
