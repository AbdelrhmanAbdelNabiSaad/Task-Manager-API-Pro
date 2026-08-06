const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/user.model');


const protect = async (req,res,next)=> {

    try {

        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            })
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, config.jwt_secret);

        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            })
        }

        req.user = user;

        next();

    }catch(error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })

    }

}

module.exports = protect;