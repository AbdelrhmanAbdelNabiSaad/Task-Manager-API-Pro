const mongoose = require('mongoose');
const config = require('./env')
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '0.0.0.0']);
const connectDB = async ()=> {

    if(mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(config.dbUrl);
        console.log(`MongoDB Connected successfully.`);
    }catch(error) {

        console.log(error.message);

        throw error;

    }

}

module.exports = connectDB;