const express = require('express');
const WatchList = require('../models/watch-list');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// Add Watch List
router.post('/watchList', auth, async (req, res) => {
    const watchList = new WatchList({
        ...req.body,
        owner: req.user._id
    });

    try {
        await watchList.save();
        res.status(201).send(watchList)

    } catch (error) {
        res.status(400).send();
    }
});

router.get('/watchLists', auth, async (req, res) => {
    const user = await User.findById(req.user._id); 

    try {
        await user.populate({
            path: 'watchList',
        }).execPopulate()
        res.status(200).send(user.watchList);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.delete('/watchList/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const watchListDelete = await WatchList.findOneAndDelete({ _id, owner: req.user._id });
        
        if (!watchListDelete) {
            return res.status(404).send()
        }

        res.send(watchListDelete);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router