exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else if (err.code === "23503") {
    if (err.constraint === "comments_article_id_fkey") {
      res.status(404).send({ msg: `Article Not Found!` });
    } else if (err.constraint === "comments_author_fkey") {
      res.status(404).send({ msg: "User Not Found!" });
    } else {
      next(err);
    }
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.catchAllErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
