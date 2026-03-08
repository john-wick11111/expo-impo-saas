import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { calculateVerificationScore } from '../src/utils/verificationScore';

const prisma = new PrismaClient();

// Configuration
const BATCH_SIZE = 1000;
const TOTAL_RECORDS_TO_GENERATE = 50000; // For demonstration purposes

// List of sample sources
const SOURCES = ['trade_directory', 'linkedin', 'company_registry', 'website_scrape', 'partner_data'];
const INDUSTRIES = ['Agriculture', 'Textiles', 'Electronics', 'Heavy Machinery', 'Medical Supplies', 'Automotive', 'Chemicals'];
const COUNTRIES = ['UAE', 'UK', 'Germany', 'USA', 'India', 'China', 'Saudi Arabia', 'Brazil', 'France', 'Japan'];
const PRODUCTS = [['Fertilizer', 'Seeds'], ['Cotton', 'Silk'], ['Semiconductors', 'PCB'], ['Cranes', 'Tractors'], ['Syringes', 'MRI'], ['Tires', 'Engine Parts'], ['Polymers', 'Acids']];

// Utility to pick a random item from array
const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Generate dummy buyer objects
function generateMockBuyers(count: number) {
    const buyers = [];
    for (let i = 0; i < count; i++) {
        const industryIndex = Math.floor(Math.random() * INDUSTRIES.length);
        const industry = INDUSTRIES[industryIndex];
        const categoryList = PRODUCTS[industryIndex];

        const email = `contact@mockcompany${i}.com`;
        const website = `www.mockcompany${i}.com`;
        const linkedin = `linkedin.com/company/mockcompany${i}`;

        const scoreData = {
            email,
            emailVerified: email ? true : false,
            website,
            websiteActive: website ? true : false,
            linkedin
        };

        buyers.push({
            companyName: `Mock Company ${Math.random().toString(36).substring(7).toUpperCase()}`,
            country: pickRandom(COUNTRIES),
            industry: industry,
            productCategory: pickRandom(categoryList),
            email: email,
            website: website,
            phone: `+1800555${String(i).padStart(4, '0')}`,
            linkedin: linkedin,
            source: pickRandom(SOURCES),
            emailVerified: scoreData.emailVerified,
            websiteActive: scoreData.websiteActive,
            verificationScore: calculateVerificationScore(scoreData)
        });
    }
    return buyers;
}

// The core engine for importing safely
async function runImport() {
    console.log(`Starting Data Engine Import... Target: ${TOTAL_RECORDS_TO_GENERATE} records.`);
    console.log(`Configured Batch Size: ${BATCH_SIZE}`);
    console.time("Total Import Time");

    let successfulImports = 0;

    // Process in batches
    for (let i = 0; i < TOTAL_RECORDS_TO_GENERATE; i += BATCH_SIZE) {
        console.log(`Generating batch ${(i / BATCH_SIZE) + 1} (${i} to ${i + BATCH_SIZE})...`);
        const batch = generateMockBuyers(BATCH_SIZE);

        try {
            // Prisma createMany is highly optimized for bulk inserts 
            const result = await prisma.buyer.createMany({
                data: batch,
                skipDuplicates: true // Critical for running imports repeatedly without crashing
            });

            successfulImports += result.count;
            console.log(`✅ Inserted ${result.count} records cleanly.`);
        } catch (error) {
            console.error(`❌ Batch ${(i / BATCH_SIZE) + 1} failed:`, error);
            // In a real production script you would log this to an error queue/file
        }
    }

    console.timeEnd("Total Import Time");
    console.log(`\nImport Complete! 🎉`);
    console.log(`Total new buyers indexed: ${successfulImports}`);
}

// Execute the pipeline
runImport()
    .catch((e) => {
        console.error("Fatal Import Error: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
