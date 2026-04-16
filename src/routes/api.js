const express = require('express');
const router = express.Router();
const classifierController = require('../controllers/classifierController');

/**
 * GET /api/classify?name={name}
 * Classifies the gender of a given name.
 */
router.get('/classify', (req, res, next) => {
    const { name } = req.query;

    // 400 Bad Request: Missing or empty name parameter
    if (!name || name.trim() === '') {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Missing or empty name parameter' 
        });
    }

    // 422 Unprocessable Entity: name is not a string
    // Basic check for string type and that it's not a numeric string
    if (typeof name !== 'string' || !isNaN(name)) {
        return res.status(422).json({ 
            status: 'error', 
            message: 'name must be a valid string' 
        });
    }

    next();
}, classifierController.classifyName);

module.exports = router;
