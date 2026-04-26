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

// // 🚀 3. DELETE a specific message
// router.delete('/:orderId/message/:messageId', async (req, res) => {
//     try {
//         const { orderId, messageId } = req.params;
//         const chat = await Chat.findOneAndUpdate(
//             { orderId: orderId },
//             { $pull: { messages: { _id: messageId } } }, // Array se message nikaal dega
//             { new: true }
//         );
//         if (!chat) return res.status(404).json({ message: "Chat not found" });
//         res.json(chat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 🚀 4. UPDATE (Edit) a specific message
// router.patch('/:orderId/message/:messageId', async (req, res) => {
//     try {
//         const { orderId, messageId } = req.params;
//         const { message } = req.body; // Isme text aur imageUrl hoga

//         const chat = await Chat.findOneAndUpdate(
//             { orderId: orderId, "messages._id": messageId },
//             { 
//                 $set: { 
//                     "messages.$.text": message.text,
//                     "messages.$.imageUrl": message.imageUrl,
//                     "messages.$.updatedAt": new Date()
//                 } 
//             },
//             { new: true }
//         );
//         if (!chat) return res.status(404).json({ message: "Chat or Message not found" });
//         res.json(chat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 5. Update Status (Approve/Reject)
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

// 1. Get Chat by Order ID
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

// 2. Admin Dashboard Statuses
router.get('/admin/all-statuses', async (req, res) => {
    try {
        const chats = await Chat.find({}, { orderId: 1, messages: 1 });
        const chatStatusList = chats.map(chat => {
            const unreadMessages = chat.messages.filter(m => m.sender === 'user' && !m.isRead);
            return {
                orderId: chat.orderId,
                hasUnread: unreadMessages.length > 0,
                unreadCount: unreadMessages.length
            };
        });
        res.json(chatStatusList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Post a message (Admin or Customer)
router.post('/:id/message', async (req, res) => {
    try {
        const { message } = req.body;
        const orderId = req.params.id;

        const chat = await Chat.findOneAndUpdate(
            { orderId: orderId },
            { $push: { messages: { ...message, timestamp: new Date() } } },
            { new: true, upsert: true }
        );

        if (message.sender === 'admin') {
            await Chat.updateOne(
                { orderId: orderId },
                { "$set": { "messages.$[elem].isRead": true } },
                { arrayFilters: [{ "elem.sender": "user" }] }
            );
        }

        const io = req.app.get('socketio');
        if (io) {
            io.emit("admin_notification", { orderId: orderId, sender: message.sender });
        }

        res.status(201).json(chat);
    } catch (err) {
        console.error("Chat Post Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// 4. Mark as read
router.patch('/mark-as-read/:orderId', async (req, res) => {
    try {
        await Chat.updateOne(
            { orderId: req.params.orderId },
            { "$set": { "messages.$[elem].isRead": true } },
            { arrayFilters: [{ "elem.sender": "user" }] }
        );
        
        const io = req.app.get('socketio');
        if (io) {
            io.emit("admin_notification", { orderId: req.params.orderId, type: "READ_UPDATE" });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Update Status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, adminMessage } = req.body;
        const orderId = req.params.id;

        const chat = await Chat.findOneAndUpdate(
            { orderId: orderId },
            { 
                $set: { status: status },
                $push: { messages: adminMessage }
            },
            { new: true }
        );

        await Chat.updateOne(
            { orderId: orderId },
            { "$set": { "messages.$[elem].isRead": true } },
            { arrayFilters: [{ "elem.sender": "user" }] }
        );

        const io = req.app.get('socketio');
        if (io) {
            io.emit("admin_notification", { orderId: orderId, type: "READ_UPDATE" });
        }

        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. DELETE Message
router.delete('/:id/message/:messageId', async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const chat = await Chat.findOneAndUpdate(
            { orderId: id },
            { $pull: { messages: { _id: messageId } } },
            { new: true }
        );
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        res.json({ success: true, message: "Deleted successfully", chat });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. EDIT/UPDATE Message (Fixed Logic)
router.patch('/:id/message/:messageId', async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const { message } = req.body;

        // Agar frontend se message object bhej raha hai (message.text), toh use pick karein
        // Warna agar seedha text bhej raha hai, toh wahi use karein.
        const newText = (message && typeof message === 'object') ? message.text : message;

        console.log("Updating to:", newText);

        const chat = await Chat.findOneAndUpdate(
            { orderId: id, "messages._id": messageId },
            { 
                $set: { 
                    "messages.$.text": newText, // Aapke model mein 'text' field hai
                    "messages.$.message": newText // Safety ke liye dono jagah update
                } 
            },
            { new: true }
        );

        if (!chat) return res.status(404).json({ message: "Message not found" });

        res.json({ success: true, chat });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;