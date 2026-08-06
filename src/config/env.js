require('dotenv').config();

module.exports = {

    port: process.env.PORT,
    appName: process.env.APP_NAME,
    dbUrl: process.env.MONGO_URL,
    jwt_secret: process.env.JWT_SECRET,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailFrom: process.env.EMAIL_FROM,
    baseUrl: process.env.BASE_URL
};