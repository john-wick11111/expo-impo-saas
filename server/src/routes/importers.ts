import { Router } from 'express';
import { prisma } from '../index';
import { fetchCompanyFromImportYeti } from '../utils/importYetiService';

const router = Router();

// GET /api/importers/search
router.get('/search', async (req, res) => {
    try {
        const { product, country, industry, q } = req.query;

        let whereCondition: any = {
            source: 'ImportYeti API'
        };

        // Reuse identical search logic from buyers.ts for UI consistency
        if (q && typeof q === 'string') {
            const queryLower = q.toLowerCase();
            whereCondition.OR = [
                { companyName: { contains: queryLower, mode: 'insensitive' } },
                { productCategory: { contains: queryLower, mode: 'insensitive' } },
                { country: { contains: queryLower, mode: 'insensitive' } },
            ];
        } else {
            if (industry) {
                whereCondition.industry = { contains: String(industry), mode: 'insensitive' };
            }
            if (product) {
                whereCondition.productCategory = { contains: String(product), mode: 'insensitive' };
            }
            if (country) {
                whereCondition.country = { contains: String(country), mode: 'insensitive' };
            }
        }

        const importers = await prisma.buyer.findMany({
            where: whereCondition,
            take: 200,
            orderBy: {
                verificationScore: 'desc'
            }
        });

        res.json(importers);
    } catch (error) {
        console.error('Error searching importers:', error);
        res.status(500).json({ error: 'Failed to search importers' });
    }
});

// POST /api/importers/fetch 
router.post('/fetch', async (req, res) => {
    try {
        const { company } = req.body;

        if (!company) {
            return res.status(400).json({ error: 'company parameter is required in the body' });
        }

        const result = await fetchCompanyFromImportYeti(company);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Error triggering ImportYeti fetch:', error);
        res.status(500).json({ error: 'Failed to process ImportYeti fetch request' });
    }
});

export default router;
