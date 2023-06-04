const express = require('express');
const config = require('config');
const sequelize = require('./db');
const router = require('./router');
const corsMiddleware = require('./middleware/cors.middleware');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

app.use('/post_photos', express.static(path.join(__dirname, 'post_photos')));
app.use('/user_photos', express.static(path.join(__dirname, 'user_photos')));
app.use(corsMiddleware);
app.use(fileUpload());
app.use(express.json());
app.use('/inFrame', router);

const PORT = process.env.port || 5000;

async function start(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

start();