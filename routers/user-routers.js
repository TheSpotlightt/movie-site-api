const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// Add user (sign up);
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        await user.save();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error)
    }
});


// Setting up login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send('Email or password not valid');
    }
});

// Setting logout (only one session);
router.post('/users/logout', auth, async (req, res) => {
    const user = req.user;

    try {
        user.tokens = user.tokens.filter(token => token.token !== req.token);
        await user.save();

        res.send('Logged out');
    } catch (error) {
        res.status(500).send()
    }
});

// Setting logout (all sessions)
router.post('/users/logoutALL', auth, async (req, res) => {
    const user = req.user;

    try {
        user.tokens = user.tokens.filter(token => token.token !== token.token);

        await user.save();

        res.send('Logged out');
    } catch (error) {
        res.status(500).send();
    }
});

// Get users profile
router.get('/users/me', auth, async (req, res) => {
    await res.send(req.user);
});


// Update Users
router.patch('/users/me', auth, async (req, res) => {
    const user = req.user;

    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach(update => user[update] = req.body[update]);

        await user.save();

        if (!user) {
            return res.status(400).send();
        }

        res.send(user);
    } catch (error) {
        res.status(400).send();
    } 
});

// Delete users
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
});

module.exports = router;