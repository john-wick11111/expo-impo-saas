import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/buyers/search
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        let whereCondition: any = {};

        if (q && typeof q === 'string') {
            let queryLower = q.toLowerCase();

            // 1. Identify country keywords and map them to full names if needed
            const countryMapping: { [key: string]: string } = {
                'uae': 'United Arab Emirates',
                'united arab emirates': 'United Arab Emirates',
                'uk': 'United Kingdom',
                'united kingdom': 'United Kingdom',
                'germany': 'Germany',
                'saudi arabia': 'Saudi Arabia',
                'usa': 'United States',
                'united states': 'United States',
                'india': 'India',
                'china': 'China',
                'france': 'France',
                'italy': 'Italy',
                'spain': 'Spain',
                'brazil': 'Brazil',
                'canada': 'Canada',
                'australia': 'Australia'
            };

            let extractedCountry = '';
            for (const countryKey of Object.keys(countryMapping)) {
                if (queryLower.includes(countryKey)) {
                    extractedCountry = countryMapping[countryKey];
                    // Remove the found key from remaining words
                    queryLower = queryLower.replace(countryKey, '');
                    break;
                }
            }

            // 2. Identify Stop Words
            const stopWords = ['buyers', 'importers', 'distributors', 'wholesalers', 'in', 'and'];

            // 3. Extract remaining keywords for product/industry
            let remainingWords = queryLower;

            const productKeywords = remainingWords
                .split(/\s+/)
                .filter(word => word.length > 2 && !stopWords.includes(word));

            let extractedProduct = productKeywords.join(' ').trim();

            const conditions = [];

            if (extractedCountry) {
                conditions.push({
                    country: {
                        contains: extractedCountry,
                        mode: 'insensitive'
                    }
                });
            }

            if (extractedProduct) {
                conditions.push({
                    OR: [
                        {
                            productCategory: {
                                contains: extractedProduct,
                                mode: 'insensitive'
                            }
                        },
                        {
                            industry: {
                                contains: extractedProduct,
                                mode: 'insensitive'
                            }
                        }
                    ]
                });
            }

            if (conditions.length > 0) {
                whereCondition = { AND: conditions };
            }

            console.log("Search parsed:", { q, extractedCountry, extractedProduct, whereCondition: JSON.stringify(whereCondition) });
        } else {
            // Fallback to older query params if q is not provided (for backward compatibility if needed)
            const { industry, product, country } = req.query;
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

        const buyers = await prisma.buyer.findMany({
            where: whereCondition,
            take: 200,
        });

        res.json(buyers);
    } catch (error) {
        console.error('Error searching buyers:', error);
        res.status(500).json({ error: 'Failed to search buyers' });
    }
});

// GET /api/buyers/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const buyer = await prisma.buyer.findUnique({
            where: { id }
        });

        if (!buyer) {
            return res.status(404).json({ error: 'Buyer not found' });
        }

        res.json(buyer);
    } catch (error) {
        console.error(`Error fetching buyer ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch buyer details' });
    }
});

export default router;
