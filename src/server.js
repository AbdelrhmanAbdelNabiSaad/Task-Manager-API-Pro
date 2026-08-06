const app = require('./app');
const config = require('./config/env');
const port = config.port;
const connectDB = require('./config/db');

async function startServer() {

    await connectDB();

    app.listen(port, ()=> {
        console.log(`Server running on port ==> ${port}`);
    })

}

startServer();