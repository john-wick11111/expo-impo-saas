import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Trending searches shown when no query typed yet
const TRENDING_SEARCHES = [
    "fertilizer buyers UAE",
    "rice importers Saudi Arabia",
    "textile distributors UK",
    "electronics wholesalers Germany",
    "spice suppliers India",
    "furniture importers USA",
];

// GET /api/search-suggestions?q=
router.get('/', async (req, res) => {
    try {
        const { q } = req.query;

        // If no query, return trending searches
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.json({ suggestions: [], trending: TRENDING_SEARCHES });
        }

        const query = q.trim();

        // If < 2 chars, return empty
        if (query.length < 2) {
            return res.json({ suggestions: [], trending: TRENDING_SEARCHES });
        }

        // Query all relevant fields in OR format
        const buyers = await prisma.buyer.findMany({
            where: {
                OR: [
                    { companyName:      { contains: query, mode: 'insensitive' } },
                    { country:          { contains: query, mode: 'insensitive' } },
                    { industry:         { contains: query, mode: 'insensitive' } },
                    { productCategory:  { contains: query, mode: 'insensitive' } },
                ]
            },
            select: {
                companyName:     true,
                country:         true,
                industry:        true,
                productCategory: true,
            },
            take: 30,
        });

        const suggestionsSet = new Set<string>();
        const queryLower = query.toLowerCase();

        buyers.forEach(buyer => {
            const prod    = buyer.productCategory?.trim();
            const country = buyer.country?.trim();
            const ind     = buyer.industry?.trim();
            const company = buyer.companyName?.trim();

            // Pattern: {product} buyers {country}
            if (prod && country) {
                suggestionsSet.add(`${prod} buyers ${country}`);
                suggestionsSet.add(`${prod} importers ${country}`);
                suggestionsSet.add(`${prod} distributors ${country}`);
                suggestionsSet.add(`${prod} suppliers ${country}`);
            }

            // Pattern: {country} {product} buyers
            if (country && prod && country.toLowerCase().includes(queryLower)) {
                suggestionsSet.add(`${country} ${prod} buyers`);
                suggestionsSet.add(`${country} ${prod} importers`);
            }

            // Pattern: {industry} distributors {country}
            if (ind && country && ind !== prod) {
                suggestionsSet.add(`${ind} distributors ${country}`);
                suggestionsSet.add(`${ind} buyers ${country}`);
            }

            // Company name as-is (e.g. "Walmart suppliers")
            if (company) {
                suggestionsSet.add(company);
                if (country) suggestionsSet.add(`${company} import partners`);
                if (company.toLowerCase().includes(queryLower)) {
                    suggestionsSet.add(`${company} suppliers`);
                    suggestionsSet.add(`${company} buyers`);
                }
            }
        });

        // Filter to only those actually matching the query, then limit to 6
        const finalSuggestions = Array.from(suggestionsSet)
            .filter(s => s.toLowerCase().includes(queryLower))
            .slice(0, 6);

        res.json({ suggestions: finalSuggestions, trending: TRENDING_SEARCHES });
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

export default router;
