const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        res.status(201).send('User created');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0) {
            const user = users[0];
            const validPass = await bcrypt.compare(password, user.password);
            if (validPass) {
                const token = jwt.sign({ id: user.id }, 'secretKey');
                res.status(200).json({ token });
            } else {
                res.status(400).send('Invalid credentials');
            }
        } else {
            res.status(400).send('User not found');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
