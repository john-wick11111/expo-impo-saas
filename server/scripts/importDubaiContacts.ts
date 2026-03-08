import * as XLSX from 'xlsx';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { calculateVerificationScore } from '../src/utils/verificationScore';

const prisma = new PrismaClient();
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000"; // Assuming this is used in the codebase

async function main() {
    console.log("Starting Dubai contacts import...");

    // Parse file
    const filePath = path.join(__dirname, '../../dubai buisness contacts.xls');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get headers first to handle possible issues, then json
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];
    console.log(`Parsed ${data.length} rows from Excel.`);

    // Ensure dummy user exists
    let user = await prisma.user.findUnique({ where: { id: DUMMY_USER_ID } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                id: DUMMY_USER_ID,
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            }
        });
    }

    // Create the BuyerList
    const listName = "Dubai Business Contacts";
    const buyerList = await prisma.buyerList.create({
        data: {
            name: listName,
            userId: DUMMY_USER_ID
        }
    });

    console.log(`Created list: ${buyerList.name} (${buyerList.id})`);

    let successCount = 0;
    let failCount = 0;

    for (const row of data) {
        if (!row['Business Name']) continue;

        try {
            const companyName = String(row['Business Name'] || '').trim();
            const email = String(row['Email'] || '').trim() || null; // Using 'Email' as per original, not 'Email Address'
            const website = String(row['Website'] || '').trim() || null;
            const phone = String(row['Phone'] || '').trim() || null; // Using 'Phone' as per original, not 'Phone Number'
            const linkedin = String(row['LinkedIn'] || '').trim() || null;

            const scoreData = {
                email,
                emailVerified: email ? true : false,
                website,
                websiteActive: website ? true : false,
                linkedin: linkedin
            };

            const buyerData = {
                companyName: companyName,
                country: 'United Arab Emirates', // Defaulting since this is Dubai contacts
                industry: 'Business', // Keeping original 'Business'
                productCategory: String(row['Company Description'] || 'General').substring(0, 50), // Using 'Company Description' if available, else 'General'
                email: email,
                website: website,
                phone: phone,
                linkedin: linkedin,
                source: 'Dubai Contacts Import', // Keeping original source
                emailVerified: scoreData.emailVerified,
                websiteActive: scoreData.websiteActive,
                verificationScore: calculateVerificationScore(scoreData)
            };

            // Create Buyer
            const buyer = await prisma.buyer.create({
                data: buyerData
            });

            // Link to list
            await prisma.buyerListItem.create({
                data: {
                    listId: buyerList.id,
                    buyerId: buyer.id
                }
            });

            successCount++;
        } catch (error) {
            console.error("Error creating buyer:", row['Business Name']);
            failCount++;
        }
    }

    console.log(`Import finished! Successfully added ${successCount} buyers to "${listName}". Failed: ${failCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
