const express = require('express');
const router = express.Router();
// 🚀 Controller se naye functions bhi import karein
const { 
    getBundles, 
    createBundle, 
    deleteBundle, 
    updateBundle, 
    getSingleBundle 
} = require('./bundle.controller');

// 1. Saare bundles hasil karne ke liye
router.get('/', getBundles);

// 2. Aik specific bundle hasil karne ke liye (Edit page ke liye)
router.get('/:id', getSingleBundle);

// 3. Naya bundle add karne ke liye
router.post('/add-bundle', createBundle);

// 4. Bundle edit/update karne ke liye
router.patch('/:id', updateBundle);

// 5. Bundle delete karne ke liye
router.delete('/:id', deleteBundle);

module.exports = router;