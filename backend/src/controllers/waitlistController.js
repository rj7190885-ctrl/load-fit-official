const waitlistService = require('../services/waitlistService');

exports.signup = async (req, res) => {
    try {
        const data = req.body;

        // Extract IP and Timestamp
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const signupData = {
            ...data,
            ipAddress,
            userAgent: req.headers['user-agent']
        };

        const result = await waitlistService.processSignup(signupData);

        res.status(201).json({
            status: 'success',
            message: 'Successfully joined the waitlist!',
            data: result
        });
    } catch (error) {
        console.error('Signup error:', error);

        // Handle specific duplication error from service layer (or supabase)
        if (error.code === '23505' || error.message === 'Email already exists') {
            return res.status(409).json({
                status: 'error',
                message: 'This email is already on the waitlist.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to process signup. Please try again later.'
        });
    }
};
