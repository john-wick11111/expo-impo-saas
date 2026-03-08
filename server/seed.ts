import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyBuyers = [
    { name: "AgriTech Global LLC", country: "United Arab Emirates", industry: "Agriculture", product: "Fertilizer", email: "procurement@agritech.ae", website: "agritech.ae", phone: "+971 50 123 4567" },
    { name: "Desert Greens Trading", country: "United Arab Emirates", industry: "Agriculture", product: "Fertilizer", email: "imports@desertgreens.com", website: "desertgreens.com", phone: "+971 4 987 6543" },
    { name: "Oasis Supply Co", country: "Saudi Arabia", industry: "Agriculture", product: "Fertilizer", email: "buy@oasissupply.sa", website: "oasissupply.sa", phone: "+966 50 111 2222" },
    { name: "Saudi Pharma Import", country: "Saudi Arabia", industry: "Pharmaceutical", product: "Bulk Drugs", email: "hello@saudipharma.com", website: "saudipharma.com", phone: "+966 55 999 8888" },
    { name: "Gulf Medicare Solutions", country: "Qatar", industry: "Pharmaceutical", product: "Medical Supplies", email: "contact@gulfmedicare.qa", website: "gulfmedicare.qa", phone: "+974 44 333 444" },
];

async function main() {
    console.log("Starting seed...");
    for (const buyer of dummyBuyers) {
        await prisma.buyer.create({
            data: {
                companyName: buyer.name,
                country: buyer.country,
                industry: buyer.industry,
                productCategory: buyer.product,
                email: buyer.email,
                website: buyer.website,
                phone: buyer.phone,
            }
        });
        console.log(`Created buyer: ${buyer.name}`);
    }
    console.log("Seed complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
