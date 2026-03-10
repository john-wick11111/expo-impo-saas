import { calculateVerificationScore } from '../src/utils/verificationScore';
import csvParser from 'csv-parser';
import path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const results: any[] = [];

    // The script will be run from the `server` directory, and the CSV is one level up in `First saas`
    const csvFilePath = path.resolve(__dirname, '../../Agricultural_production_United_Arab_Emirates_results_all_2026-01-29.csv');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`CSV file not found at path: ${csvFilePath}`);
        process.exit(1);
    }

    console.log(`Reading CSV from ${csvFilePath}...`);

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
            console.log(`Parsed ${results.length} records. Beginning sequential import...`);

            let buyersInserted = 0;
            let sellersInserted = 0;
            let duplicatesSkipped = 0;

            for (const row of results) {
                const companyName = row['Business Name'] || 'Unknown Company';
                const phone = row['Phone'] || null;
                const website = row['Website'] || null;
                const email = row['Email'] || null;
                let linkedin = row['LinkedIn'] || null;
                if (linkedin === '') linkedin = null;

                const category = row['Category'] || 'Agriculture';

                if (companyName === 'Unknown Company') {
                    continue;
                }

                const scoreData = {
                    email,
                    emailVerified: email ? true : false,
                    website,
                    websiteActive: website ? true : false,
                    linkedin,
                };

                const country = 'United Arab Emirates';

                // Duplicate Check
                const existingBuyer = await prisma.buyer.findFirst({
                    where: {
                        companyName: {
                            equals: companyName,
                            mode: 'insensitive'
                        },
                        country: {
                            equals: country,
                            mode: 'insensitive'
                        }
                    }
                });

                if (existingBuyer) {
                    duplicatesSkipped++;
                    continue; // Skip this record to prevent duplicates
                }

                const record = {
                    companyName,
                    country: country,
                    industry: 'Agriculture',
                    productCategory: category,
                    email,
                    website,
                    phone,
                    linkedin,
                    source: 'agricultural_production_csv',
                    emailVerified: scoreData.emailVerified,
                    websiteActive: scoreData.websiteActive,
                    verificationScore: calculateVerificationScore(scoreData)
                };

                try {
                    await prisma.buyer.create({ data: record });
                    buyersInserted++;

                    // Also populate the Seller table for this user as per previous logic
                    await prisma.seller.create({ data: record });
                    sellersInserted++;
                } catch (err) {
                    console.error(`Failed to insert record: ${companyName}`);
                    console.error(err);
                }
            }

            console.log(`\nImport Summary:`);
            console.log(`----------------`);
            console.log(`New Buyers Inserted: ${buyersInserted}`);
            console.log(`New Sellers Inserted: ${sellersInserted}`);
            console.log(`Duplicates Skipped: ${duplicatesSkipped}`);
            console.log('Import complete.');

            await prisma.$disconnect();
        });
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
