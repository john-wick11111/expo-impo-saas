import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/buyers/top-performing
router.get('/top-performing', async (req, res) => {
    try {
        const { country, industry, productCategory } = req.query;

        const where: any = {};
        if (country && typeof country === 'string') {
            where.country = { contains: country, mode: 'insensitive' };
        }
        if (industry && typeof industry === 'string') {
            where.industry = { contains: industry, mode: 'insensitive' };
        }
        if (productCategory && typeof productCategory === 'string') {
            where.productCategory = { contains: productCategory, mode: 'insensitive' };
        }

        const buyers = await prisma.buyer.findMany({
            where,
            orderBy: { verificationScore: 'desc' },
            take: 8,
            select: {
                id: true,
                companyName: true,
                country: true,
                industry: true,
                productCategory: true,
                website: true,
                email: true,
                verificationScore: true,
            }
        });

        res.json(buyers);
    } catch (error) {
        console.error('Error fetching top-performing buyers:', error);
        res.status(500).json({ error: 'Failed to fetch top-performing buyers' });
    }
});

// GET /api/buyers/suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string' || q.length < 2) {
            return res.json([]);
        }

        // Query the database for buyers matching the query in category, industry, or country
        const buyers = await prisma.buyer.findMany({
            where: {
                OR: [
                    { productCategory: { contains: q, mode: 'insensitive' } },
                    { industry: { contains: q, mode: 'insensitive' } },
                    { country: { contains: q, mode: 'insensitive' } }
                ]
            },
            select: {
                productCategory: true,
                industry: true,
                country: true,
                companyName: true
            },
            take: 20
        });

        const suggestionsSet = new Set<string>();

        // Generate combinations like "{product} buyers {country}"
        buyers.forEach(buyer => {
            if (buyer.productCategory && buyer.country) {
                // E.g., "fertilizer buyers UAE"
                suggestionsSet.add(`${buyer.productCategory.toLowerCase()} buyers ${buyer.country}`);
            }
            if (buyer.industry && buyer.country) {
                // E.g., "Agriculture distributors UAE"
                suggestionsSet.add(`${buyer.industry.toLowerCase()} distributors ${buyer.country}`);
            }
            if (buyer.companyName) {
                suggestionsSet.add(buyer.companyName);
            }
        });

        // Filter out specific matches to the query and limit to 6
        const queryLower = q.toLowerCase();
        const finalSuggestions = Array.from(suggestionsSet)
            .filter(s => s.toLowerCase().includes(queryLower))
            .slice(0, 6);

        res.json(finalSuggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

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
