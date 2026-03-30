// const express = require('express');
// const Chat = require('./chats.model');
// const router = express.Router();

// // 1. Get Chat by Order ID (or create if not exists)
// router.get('/:id', async (req, res) => {
//     try {
//         let chat = await Chat.findOne({ orderId: req.params.id });
//         if (!chat) {
//             chat = new Chat({ orderId: req.params.id, messages: [] });
//             await chat.save();
//         }
//         res.json(chat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 2. Post a message to the chat
// router.post('/:id/message', async (req, res) => {
//     try {
//         const { message } = req.body;
//         const chat = await Chat.findOneAndUpdate(
//             { orderId: req.params.id },
//             { $push: { messages: message } },
//             { new: true }
//         );
//         res.status(201).json(chat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 3. Update Status (Approve/Reject)
// router.patch('/:id/status', async (req, res) => {
//     try {
//         const { status, adminMessage } = req.body;
//         const chat = await Chat.findOneAndUpdate(
//             { orderId: req.params.id },
//             { 
//                 $set: { status: status },
//                 $push: { messages: adminMessage }
//             },
//             { new: true }
//         );
//         res.json(chat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;




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

// 🚀 3. DELETE a specific message
router.delete('/:orderId/message/:messageId', async (req, res) => {
    try {
        const { orderId, messageId } = req.params;
        const chat = await Chat.findOneAndUpdate(
            { orderId: orderId },
            { $pull: { messages: { _id: messageId } } }, // Array se message nikaal dega
            { new: true }
        );
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🚀 4. UPDATE (Edit) a specific message
router.patch('/:orderId/message/:messageId', async (req, res) => {
    try {
        const { orderId, messageId } = req.params;
        const { message } = req.body; // Isme text aur imageUrl hoga

        const chat = await Chat.findOneAndUpdate(
            { orderId: orderId, "messages._id": messageId },
            { 
                $set: { 
                    "messages.$.text": message.text,
                    "messages.$.imageUrl": message.imageUrl,
                    "messages.$.updatedAt": new Date()
                } 
            },
            { new: true }
        );
        if (!chat) return res.status(404).json({ message: "Chat or Message not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Update Status (Approve/Reject)
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