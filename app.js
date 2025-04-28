const express = require('express');
const app = express();
const db = require('./db/connection');
const {getApi, getTopics, getArticleById} = require('./src/controllers/controllers');
const { handlePSQLErrors, catchAllErrors, handleCustomErrors } = require('./src/controllers/error.controller');



app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics )

app.get('/api/articles/:article_id', getArticleById)

app.all('/*splat', (req, res)=> {
    res.status(404).send({msg: 'invalid url!'})
})

app.use(handlePSQLErrors);

app.use(handleCustomErrors)

app.use(catchAllErrors);

module.exports = app;
