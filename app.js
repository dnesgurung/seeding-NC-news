const express = require('express');
const app = express();
const db = require('./db/connection');
const {getApi} = require('./src/controllers/controllers')



app.use(express.json());

app.get('/api', getApi)

module.exports = app;
