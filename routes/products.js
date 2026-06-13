const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/products
router.get('/', (req, res) => {
    const category = req.query.category;
    let query = `SELECT * FROM Products`;
    let params = [];

    if (category && category !== 'All Products') {
        query += ` WHERE category = ?`;
        params.push(category);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    db.get(`SELECT * FROM Products WHERE id = ?`, [productId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    });
});

module.exports = router;
