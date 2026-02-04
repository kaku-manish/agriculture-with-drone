const jwt = require('jsonwebtoken');
const SECRET_KEY = 'paddy_secret_key'; // In a real production app, use process.env.JWT_SECRET

/**
 * Authentication Middleware
 * Usage: auth('admin') or auth('farmer')
 */
const auth = (requiredRole) => {
    return (req, res, next) => {
        // 1. Get token from headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // DEVELOPMENT BYPASS:
        // Since the current login process might not be sending tokens yet,
        // we allow requests to pass but log a note. 
        // Remove the bypass lines below once you've updated the frontend to send tokens.

        // --- BYPASS START ---
        // console.log(`[Middleware] Auth check for ${requiredRole}. Bypassing for now...`);
        return next();
        // --- BYPASS END ---

        /* 
        // UNCOMMENT THIS SECTION TO ENABLE STRICT JWT CHECKING
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;

            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).json({ error: `Access denied. Requires ${requiredRole} role.` });
            }

            next();
        } catch (err) {
            res.status(400).json({ error: 'Invalid token.' });
        }
        */
    };
};

module.exports = auth;
