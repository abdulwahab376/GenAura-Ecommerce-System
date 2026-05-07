const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dealPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    badgeText: { type: String, default: "HOT DEAL" },
    image: { type: String, required: true }, // Main display image (string)
    
    // 🚀 YEH LINE ADD KAREIN (Multiple images save karne ke liye)
    images: [{ type: String }], 
    
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Bundle', bundleSchema);