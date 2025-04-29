const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
} = require("../models/models");

exports.getApi = (request, response) => {
  response.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  return selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res) => {
 
  return selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};
