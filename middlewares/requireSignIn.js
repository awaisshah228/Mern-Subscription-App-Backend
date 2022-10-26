const jwt = require('jsonwebtoken');

const requiresSignIn = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).send({
            success: false,
            message: 'Authentication Error | No Headers Found'
        });

    }

    const userToken = authHeader.split(' ')[1];

    try {

        const payload = jwt.verify(userToken, process.env.JWT_SECRET);

        req.user = {
            userId: payload.userId
        }

        next();

    } catch (error) {
        
        return res.status(500).send({
            success: false,
            message: 'Invalid Authentication'
        });
        
    }
};


export { requiresSignIn };