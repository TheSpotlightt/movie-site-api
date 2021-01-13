const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db/mongoose');

// Import routers
const userRouter = require('./routers/user-routers');
const watchListRouter = require('./routers/watch-list');
const app = express();
const port = process.env.PORT; 

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(userRouter);
app.use(watchListRouter);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({ extended: false })
);

app.listen(port);