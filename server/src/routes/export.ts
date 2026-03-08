import { Router } from 'express';
import { prisma } from '../index';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

const router = Router();

// In a real app, userId should come from auth middleware
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// GET /api/export/leads
router.get('/leads', async (req, res) => {
    try {
        const { format = 'csv', source = 'all', listId, searchQuery } = req.query;

        let buyersData: any[] = [];

        // 1. Fetch the data based on the source
        if (source === 'list' && listId) {
            // Export from a specific Saved List
            const listItems = await prisma.buyerListItem.findMany({
                where: {
                    listId: String(listId),
                    list: { userId: DUMMY_USER_ID } // Ensure ownership
                },
                include: { buyer: true }
            });
            buyersData = listItems.map(item => item.buyer);

        } else if (source === 'crm') {
            // Export from CRM Pipeline
            const leads = await prisma.lead.findMany({
                where: { userId: DUMMY_USER_ID },
                include: { buyer: true }
            });
            // Filter out leads without a buyer attached
            buyersData = leads.filter(lead => lead.buyer).map(lead => lead.buyer);

        } else if (source === 'all') {
            // Export from Lead Generator (all buyers, optionally filtered by search)
            let whereClause: any = {};
            if (searchQuery) {
                const searchStr = String(searchQuery);
                whereClause = {
                    OR: [
                        { companyName: { contains: searchStr, mode: 'insensitive' } },
                        { country: { contains: searchStr, mode: 'insensitive' } },
                        { industry: { contains: searchStr, mode: 'insensitive' } },
                        { productCategory: { contains: searchStr, mode: 'insensitive' } }
                    ]
                };
            }
            buyersData = await prisma.buyer.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' } // Keep some logical order
            });
        }

        if (buyersData.length === 0) {
            return res.status(404).json({ error: 'No data found to export' });
        }

        // 2. Format the data for export
        const exportData = buyersData.map(buyer => ({
            'Company Name': buyer.companyName,
            'Country': buyer.country,
            'Industry': buyer.industry,
            'Product Category': buyer.productCategory || '',
            'Website': buyer.website || '',
            'Email': buyer.email || '',
            'Phone': buyer.phone || '',
            'LinkedIn': buyer.linkedin || '',
        }));

        // 3. Generate file based on format
        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(exportData);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="exported_leads.csv"');
            return res.send(csvData);

        } else if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Exported Leads');

            // Define columns
            worksheet.columns = [
                { header: 'Company Name', key: 'Company Name', width: 30 },
                { header: 'Country', key: 'Country', width: 20 },
                { header: 'Industry', key: 'Industry', width: 20 },
                { header: 'Product Category', key: 'Product Category', width: 20 },
                { header: 'Website', key: 'Website', width: 30 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Phone', key: 'Phone', width: 20 },
                { header: 'LinkedIn', key: 'LinkedIn', width: 30 },
            ];

            // Add rows
            worksheet.addRows(exportData);

            // Style headers
            worksheet.getRow(1).font = { bold: true };

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="exported_leads.xlsx"');

            await workbook.xlsx.write(res);
            res.end();

        } else {
            res.status(400).json({ error: 'Invalid format requested. Valid options are "csv" or "excel".' });
        }

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to generate export file' });
    }
});

export default router;
