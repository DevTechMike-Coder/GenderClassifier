const axios = require('axios');

/**
 * Controller to handle name classification
 */
exports.classifyName = async (req, res) => {
    const { name } = req.query;

    try {
        // External API integration with Genderize.io
        const response = await axios.get(`https://api.genderize.io/?name=${name}`);
        const { gender, probability, count } = response.data;

        // Genderize edge cases: if response comes back with gender: null or count: 0
        if (gender === null || count === 0) {
            return res.status(200).json({ 
                status: 'error', 
                message: 'No prediction available for the provided name' 
            });
        }

        const sample_size = count;
        // Compute is_confident: probability >= 0.7 AND sample_size >= 100
        const is_confident = probability >= 0.7 && sample_size >= 100;
        
        // Generate processed_at: UTC ISO 8601
        const processed_at = new Date().toISOString();

        return res.json({
            status: 'success',
            data: {
                name,
                gender,
                probability,
                sample_size,
                is_confident,
                processed_at
            }
        });

    } catch (error) {
        // Handle upstream or server failures
        if (error.response) {
            // Upstream failure (e.g., 502 Bad Gateway)
            return res.status(502).json({ 
                status: 'error', 
                message: 'Upstream failure' 
            });
        }
        
        // Generic server failure
        return res.status(500).json({ 
            status: 'error', 
            message: 'Internal server failure' 
        });
    }
};
