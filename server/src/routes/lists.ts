import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// In a real app, userId should come from auth middleware
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

// GET /api/lists - Get all lists for a user
router.get('/', async (req, res) => {
    try {
        const lists = await prisma.buyerList.findMany({
            where: { userId: DUMMY_USER_ID },
            include: {
                _count: {
                    select: { items: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform shape slightly for the frontend if needed
        const formattedLists = lists.map(list => ({
            id: list.id,
            name: list.name,
            createdAt: list.createdAt,
            buyersCount: list._count.items
        }));

        res.json(formattedLists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
});

// GET /api/lists/:id - Get a single list with its items
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const list = await prisma.buyerList.findUnique({
            where: { id, userId: DUMMY_USER_ID },
            include: {
                items: {
                    include: { buyer: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        res.json(list);
    } catch (error) {
        console.error('Error fetching list:', error);
        res.status(500).json({ error: 'Failed to fetch list' });
    }
});

// POST /api/lists - Create a new list
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'List name is required' });
        }

        // Ensure user exists (dummy login workaround)
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

        const list = await prisma.buyerList.create({
            data: {
                name,
                userId: DUMMY_USER_ID
            }
        });

        res.json(list);
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ error: 'Failed to create list' });
    }
});

// POST /api/lists/add-buyer - Add a buyer to a list
router.post('/add-buyer', async (req, res) => {
    try {
        const { listId, buyerId } = req.body;

        if (!listId || !buyerId) {
            return res.status(400).json({ error: 'List ID and Buyer ID are required' });
        }

        // Verify list ownership
        const list = await prisma.buyerList.findUnique({
            where: { id: listId, userId: DUMMY_USER_ID }
        });

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Check if already in list
        const existingItem = await prisma.buyerListItem.findFirst({
            where: { listId, buyerId }
        });

        if (existingItem) {
            return res.status(400).json({ error: 'Buyer is already in this list' });
        }

        const item = await prisma.buyerListItem.create({
            data: {
                listId,
                buyerId
            }
        });

        res.json(item);
    } catch (error) {
        console.error('Error adding buyer to list:', error);
        res.status(500).json({ error: 'Failed to add buyer to list' });
    }
});

// DELETE /api/lists/:id/buyers/:buyerId - Remove a buyer from a list
router.delete('/:id/buyers/:buyerId', async (req, res) => {
    try {
        const { id, buyerId } = req.params;

        // Verify list ownership
        const list = await prisma.buyerList.findUnique({
            where: { id, userId: DUMMY_USER_ID }
        });

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Find the item to delete
        const item = await prisma.buyerListItem.findFirst({
            where: { listId: id, buyerId }
        });

        if (!item) {
            return res.status(404).json({ error: 'Buyer not found in list' });
        }

        await prisma.buyerListItem.delete({
            where: { id: item.id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error removing buyer from list:', error);
        res.status(500).json({ error: 'Failed to remove buyer from list' });
    }
});

export default router;
