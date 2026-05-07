const express = require('express');
const router = express.Router();
const { getBundles, createBundle } = require('./bundle.controller');

router.get('/', getBundles);
router.post('/add-bundle', createBundle);

module.exports = router;