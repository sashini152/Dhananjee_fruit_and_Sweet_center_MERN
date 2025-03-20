const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;  // Access token from cookies

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        // Verify token using the secret key
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                console.error("JWT Verification Error:", err);  // Log the verification error
                return res.status(401).json({
                    message: "Invalid or expired token.",
                    error: true,
                    success: false
                });
            }

            // If verification successful, attach the user ID to the request object
            req.userId = decoded?._id;

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (err) {
        console.error("Error in authToken middleware:", err.message);
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
