const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key_change_in_production';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// POST /api/orders/checkout
router.post('/checkout', authenticateToken, (req, res) => {
    const { items, total } = req.body; // items: [{ productId, quantity, price }]
    const userId = req.user.userId;

    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(`INSERT INTO Orders (userId, total) VALUES (?, ?)`, [userId, total], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to create order' });
            }

            const orderId = this.lastID;
            const stmt = db.prepare(`INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`);

            for (const item of items) {
                stmt.run(orderId, item.productId, item.quantity, item.price, (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Failed to insert order items' });
                    }
                });
            }

            stmt.finalize();

            db.run('COMMIT', (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to commit transaction' });
                }
                res.status(201).json({ message: 'Order placed successfully', orderId });
            });
        });
    });
});

module.exports = router;
