const db = require("../../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};

exports.selectAllArticles = () => {
  // Query for article without body
  let queryStr = `SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`;
  let greenList = "created_at";
  let sortQuery = ` ORDER BY ${greenList} DESC`;

  queryStr += sortQuery;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.selectAllCommentsForArticle = (articleId) => {
  let queryStr = `SELECT * FROM comments`;
  let queryArgs = [];

  let greenListSort = "created_at";
  let sortQuery = ` ORDER BY ${greenListSort} ASC`;

  if (articleId) {
    queryStr += ` WHERE article_id = $1`;
    queryStr += sortQuery;
    queryArgs.push(articleId);
  }

  return db.query(queryStr, queryArgs).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No comments found for article_id ${articleId}`,
      });
    }
    return rows;
  });
};

exports.insertComments = (username, body, articleId) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Missing Username!",
    });
  }

  if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Missing Comments!",
    });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, article_id) 
      VALUES($1, $2, $3) RETURNING *`,
      [username, body, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleByArticleId = (inc_votes, articleId) => {
  if (typeof inc_votes !== "number" && inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Vote needs to be a number not a string!",
    });
  }
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid vote!",
    });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, articleId]
    )
    .then(({ rows }) => {
      //console.log(rows);
      if (rows.length === 0 || rows.length === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Article ${articleId} Not Found!`,
        });
      }
      return rows[0];
    });
};
