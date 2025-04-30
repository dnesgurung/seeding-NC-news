const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  selectAllCommentsForArticle,
  insertComments,
  updateArticleByArticleId,
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

exports.getAllCommentsForArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  return selectAllCommentsForArticle(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsForAnArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  //console.log(articleId);

  return insertComments(username, body, articleId)
    .then((comment) => {
      //console.log(comment, "<<< controller");
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes } = req.body;

  return updateArticleByArticleId(inc_votes, articleId).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};
