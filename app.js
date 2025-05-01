const express = require("express");
const app = express();
const db = require("./db/connection");

const {
  getApi,
  getTopics,
  getArticleById,
  getAllArticles,
  getAllCommentsForArticle,
  postCommentsForAnArticle,
  patchArticleByArticleId,
  deleteComments
} = require("./src/controllers/controllers");
const {
  handlePSQLErrors,
  catchAllErrors,
  handleCustomErrors,
} = require("./src/controllers/error.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsForArticle);

app.post("/api/articles/:article_id/comments", postCommentsForAnArticle);

app.patch("/api/articles/:article_id", patchArticleByArticleId);

app.delete('/api/comments/:comment_id', deleteComments )

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "invalid url!" });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(catchAllErrors);

module.exports = app;
