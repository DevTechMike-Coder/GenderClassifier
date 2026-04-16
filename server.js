const express = require('express');
const dotenv = require('dotenv');
const apiRoutes = require('./src/routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Header: Access-Control-Allow-Origin: *
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server failure' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
