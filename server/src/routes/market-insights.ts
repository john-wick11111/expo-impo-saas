import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/market-insights
router.get('/', async (req, res) => {
    try {
        const { productCategory } = req.query;

        if (!productCategory || typeof productCategory !== 'string') {
            return res.status(400).json({ error: 'productCategory query parameter is required' });
        }

        // Aggregate buyers by country where productCategory matches the search query.
        // We do a case-insensitive contains search across the database.
        const importMarkets = await prisma.buyer.groupBy({
            by: ['country'],
            where: {
                productCategory: {
                    contains: productCategory,
                    mode: 'insensitive' // Requires PostgreSQL provider which we have
                }
            },
            _count: {
                country: true
            },
            orderBy: {
                _count: {
                    country: 'desc'
                }
            }
        });

        // Format the results into a cleaner structure for the frontend
        const formattedResults = importMarkets.map((market) => ({
            country: market.country,
            importerCount: market._count.country,
            marketScore: market._count.country > 200 ? 'High' : market._count.country > 100 ? 'Medium' : 'Low'
        }));

        res.json(formattedResults);

    } catch (error) {
        console.error('Error fetching market insights:', error);
        res.status(500).json({ error: 'Failed to fetch market insights' });
    }
});

export default router;
