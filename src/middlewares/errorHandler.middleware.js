const errorHandler = (err,req,res,next)=> {

    err.statusCode = err.statusCode || 500;

    err.status = err.status || 'error';

    if(err.name === 'CastError') {
        err.message = 'Invalid Id';
        err.statusCode = 400;
    }

    if(err.code === 11000) {
        err.message = 'Email already exist';
        err.statusCode = 409
    }

    if(err.name === 'ValidationError') {
        err.message = Object.values(err.errors).map(error=> error.message).join(', ');
        err.statusCode=400;
    }

    if(err.name === 'JsonWebTokenError') {
        err.message = 'Invalid Token';
        err.statusCode = 401;
    }

    if(err.name === 'TokenExpiredError') {
        err.message = 'Token Expired';
        err.statusCode = 401
    }

    return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
    });

}

module.exports = errorHandler;