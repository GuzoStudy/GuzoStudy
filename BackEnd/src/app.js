require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const listEndpoints = require('express-list-endpoints');

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api', routes);

// Verify mounted routes
console.log("Registered routes:", listEndpoints(app));

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
module.exports = app;
