import { parse } from 'csv-parse';
import { calculateVerificationScore } from '../src/utils/verificationScore';
import csvParser from 'csv-parser';
import path from 'path';

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
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`Parsed ${results.length} records.`);

            const buyersToInsert: any[] = [];
            const sellersToInsert: any[] = [];

            for (const row of results) {
                const companyName = row['Business Name'] || 'Unknown Company';
                const phone = row['Phone'] || null;
                const website = row['Website'] || null;
                const email = row['Email'] || null;
                let linkedin = row['LinkedIn'] || null;
                if (linkedin === '') linkedin = null;

                const category = row['Category'] || 'Agriculture';

                const scoreData = {
                    email,
                    emailVerified: email ? true : false,
                    website,
                    websiteActive: website ? true : false,
                    linkedin, // Use the extracted linkedin
                };

                const record = {
                    companyName,
                    country: 'United Arab Emirates', // Sourced from UAE list
                    industry: 'Agriculture',
                    productCategory: category,
                    email,
                    website,
                    phone,
                    linkedin,
                    source: 'agriculture_production_csv',
                    emailVerified: scoreData.emailVerified,
                    websiteActive: scoreData.websiteActive,
                    verificationScore: calculateVerificationScore(scoreData)
                };

                buyersToInsert.push(record);
                sellersToInsert.push(record);
            }

            try {
                console.log(`Inserting ${buyersToInsert.length} buyers...`);
                // We use createMany and skipDuplicates if there were Unique constraints.
                // Since we don't have unique constraints on companyName, this will insert duplicates if run twice.
                const createdBuyers = await prisma.buyer.createMany({
                    data: buyersToInsert,
                    skipDuplicates: true
                });
                console.log(`Successfully inserted ${createdBuyers.count} buyers.`);

                console.log(`Inserting ${sellersToInsert.length} sellers...`);
                const createdSellers = await prisma.seller.createMany({
                    data: sellersToInsert,
                    skipDuplicates: true
                });
                console.log(`Successfully inserted ${createdSellers.count} sellers.`);

                console.log('Import complete.');
            } catch (error) {
                console.error('Error inserting data:', error);
            } finally {
                await prisma.$disconnect();
            }
        });
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
