const mongoose = require('mongoose');
const config = require('./env')
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '0.0.0.0']);
const connectDB = async ()=> {

    try {
        await mongoose.connect(config.dbUrl);
        console.log(`MongoDB Connected successfully.`);
    }catch(error) {

        console.log(error.message);

        process.exit(1);

    }

}

module.exports = connectDB;