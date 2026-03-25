const express = require('express');
const Chat = require('./chats.model');
const router = express.Router();

// 1. Get Chat by Order ID (or create if not exists)
router.get('/:id', async (req, res) => {
    try {
        let chat = await Chat.findOne({ orderId: req.params.id });
        if (!chat) {
            chat = new Chat({ orderId: req.params.id, messages: [] });
            await chat.save();
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Post a message to the chat
router.post('/:id/message', async (req, res) => {
    try {
        const { message } = req.body;
        const chat = await Chat.findOneAndUpdate(
            { orderId: req.params.id },
            { $push: { messages: message } },
            { new: true }
        );
        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Update Status (Approve/Reject)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, adminMessage } = req.body;
        const chat = await Chat.findOneAndUpdate(
            { orderId: req.params.id },
            { 
                $set: { status: status },
                $push: { messages: adminMessage }
            },
            { new: true }
        );
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;