const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async(req,res)=> {

    try {
        await connectDB();
    }catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Database Connection failed',
        });
    }

    return app(req,res);

}

