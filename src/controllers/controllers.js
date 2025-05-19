const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  selectAllCommentsForArticle,
  insertComments,
  updateArticleByArticleId,
  deleteCommentsByCommentId,
  selectUsers,
  selectUserByUserName,
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

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  return selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
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

  return insertComments(username, body, articleId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes } = req.body;

  return updateArticleByArticleId(inc_votes, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComments = (req, res, next) => {
  const commentsId = req.params.comment_id;

  return deleteCommentsByCommentId(commentsId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  return selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUser = ()=> {

  return selectUserByUserName().then(()=> {})
}
