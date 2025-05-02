const db = require("../../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
  .query(`SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [articleId])
    .then(({ rows }) => {;
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};

exports.selectAllArticles = (sort_by, order, topic) => {
  // Query for article without body

  const checkIfTopicExists = (topic) => {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({
            status: 404,
            msg: "Topic Not Found!",
          });
        } else {
          return true;
        }
      });
  };
  const queryValues = [];

  let queryStr = `SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const promiseArray = [];

  let sortGreenList = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  let orderGreenList = ["ASC", "DESC"];

  if (
    (sort_by && !sortGreenList.includes(sort_by)) ||
    (order && !orderGreenList.includes(order.toUpperCase()))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid request!",
    });
  }

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
    promiseArray.push(checkIfTopicExists(topic));
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by && sortGreenList.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  if (order && orderGreenList.includes(order.toUpperCase())) {
    queryStr += ` ${order}`;
  } else {
    queryStr += ` desc`;
  }

  promiseArray.unshift(db.query(queryStr, queryValues));

  return Promise.all(promiseArray).then(([articlesResult]) => {
    return articlesResult.rows;
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
      if (rows.length === 0 || rows.length === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Article ${articleId} Not Found!`,
        });
      }
      return rows[0];
    });
};

exports.deleteCommentsByCommentId = (commentsId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentsId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment Not Found!",
        });
      }
      return rows;
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
