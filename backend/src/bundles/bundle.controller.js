const Bundle = require('./bundle.model');

const getBundles = async (req, res) => {
    try {
        const bundles = await Bundle.find({ isActive: true });
        res.status(200).json(bundles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBundle = async (req, res) => {
    try {
        const newBundle = new Bundle(req.body);
        await newBundle.save();
        res.status(201).json(newBundle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getBundles, createBundle };