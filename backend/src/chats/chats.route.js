const express = require('express');
const Chat = require('./chats.model');
const router = express.Router();

// ==========================================
// NEW: Get Total Unread Count for Admin Navbar
// ==========================================
router.get('/admin/unread-count', async (req, res) => {
    try {
        const chats = await Chat.find({});
        let totalUnread = 0;
        
        chats.forEach(chat => {
            // Sirf wo messages count karein jo user ne bheje aur unread hain
            const count = chat.messages.filter(m => m.sender === 'user' && !m.isRead).length;
            totalUnread += count;
        });

        res.json({ totalUnreadCount: totalUnread });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

// 6. DELETE Entire Chat (New functionality for Admin)
router.delete('/delete-chat/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await Chat.deleteOne({ orderId: orderId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const io = req.app.get('socketio');
        if (io) {
            io.emit("admin_notification", { type: "CHAT_DELETED", orderId: orderId });
        }

        res.json({ success: true, message: "Entire chat deleted from backend" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. DELETE Specific Message
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

// 8. EDIT/UPDATE Message (Fixed Logic)
router.patch('/:id/message/:messageId', async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const { message } = req.body;

        const newText = (message && typeof message === 'object') ? message.text : message;

        const chat = await Chat.findOneAndUpdate(
            { orderId: id, "messages._id": messageId },
            { 
                $set: { 
                    "messages.$.text": newText, 
                    "messages.$.message": newText 
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