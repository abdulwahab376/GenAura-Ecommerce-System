// const mongoose = require('mongoose');

// const ChatSchema = new mongoose.Schema({
//     orderId: { type: String, required: true, unique: true },
//     status: { 
//         type: String, 
//         enum: ['Pending', 'Approved', 'Rejected'], 
//         default: 'Pending' 
//     },
//     messages: [
//         {
//             sender: { type: String, enum: ['admin', 'user'], required: true },
//             text: { type: String },
//             imageUrl: { type: String },
//             createdAt: { type: Date, default: Date.now }
//         }
//     ]
// }, { timestamps: true });

// module.exports = mongoose.model('Chat', ChatSchema);



const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    messages: [
        {
            sender: { type: String, enum: ['admin', 'user'], required: true },
            text: { type: String },
            imageUrl: { type: String },
            // ✅ Nayi field: Default false hogi, jab admin dekh lega to true kar denge
            isRead: { type: Boolean, default: false }, 
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);