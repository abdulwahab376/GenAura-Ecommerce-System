const Bundle = require('./bundle.model');

// 1. Saare active bundles hasil karein
const getBundles = async (req, res) => {
    try {
        const bundles = await Bundle.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(bundles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Aik specific bundle hasil karein (Edit page ke liye)
const getSingleBundle = async (req, res) => {
    try {
        const bundle = await Bundle.findById(req.params.id);
        if (!bundle) return res.status(404).json({ message: "Bundle not found" });
        res.status(200).json(bundle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Naya bundle create karein
const createBundle = async (req, res) => {
    try {
        const newBundle = new Bundle(req.body);
        await newBundle.save();
        res.status(201).json(newBundle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Bundle update/edit karein
const updateBundle = async (req, res) => {
    try {
        const updatedBundle = await Bundle.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!updatedBundle) return res.status(404).json({ message: "Bundle not found" });
        res.status(200).json(updatedBundle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Bundle delete karein
const deleteBundle = async (req, res) => {
    try {
        const deletedBundle = await Bundle.findByIdAndDelete(req.params.id);
        if (!deletedBundle) return res.status(404).json({ message: "Bundle not found" });
        res.status(200).json({ message: "Bundle deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getBundles, 
    getSingleBundle, 
    createBundle, 
    updateBundle, 
    deleteBundle 
};