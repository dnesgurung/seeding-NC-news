const express = require('express');
const app = express();
const db = require('./db/connection');
const {getApi, getTopics, catchAll} = require('./src/controllers/controllers')



app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics )




app.all('/*splat', (req, res)=> {
    res.status(404).send({msg: 'invalid url!'})
})


app.use(catchAll);
module.exports = app;
