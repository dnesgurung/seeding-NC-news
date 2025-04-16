const db = require("../connection");
const format = require("pg-format");
const {convertTimestampToDate, createRef} = require("../seeds/utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  //<< write your first query in here.
  return db
  .query( `DROP TABLE IF EXISTS comments`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(()=> {
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(()=> {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR(200) NOT NULL PRIMARY KEY,
      description VARCHAR(200),
      img_url VARCHAR(1000)
      )`)
    })
  .then(()=> {
    return db.query(`CREATE TABLE users(
      username VARCHAR(200)PRIMARY KEY,
      name VARCHAR(200),
      avatar_url VARCHAR(1000)

      )`)
  })
  .then(()=> {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      topic VARCHAR(200),
      author VARCHAR(200),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      FOREIGN KEY (author) REFERENCES users(username)

      )`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(200),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      FOREIGN KEY (author) REFERENCES users(username)
      )`)
  })
  .then(()=>{
    const formattedTopics = topicData.map((topic) => {
      return [
        topic.slug,
        topic.description,
        topic.img_url
      ];
    });
    const insertTopicsQuery = format(`INSERT INTO topics
      (slug, description,img_url) VALUES %L`, formattedTopics);
    return db.query(insertTopicsQuery);

  })
  .then(()=> {
    const formattedUsers = userData.map((user)=> {
      return [
        user.username,
        user.name,
        user.avatar_url
      ];
    });
    const insertUsersQuery = format(`INSERT INTO users
      (username, name, avatar_url) VALUES %L`, formattedUsers);
      return db.query(insertUsersQuery);
  })
  .then(()=>{
    const formattedArticles = articleData.map((article)=>{
    const correctedData = convertTimestampToDate(article);
    return [
        correctedData.title,
        correctedData.topic,
        correctedData.author,
        correctedData.body,
        correctedData.created_at,
        correctedData.votes,
        correctedData.article_img_url
      ];
    });
    const insertArticlesQuery = format( `INSERT INTO articles
      ( title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticles);
      return db.query(insertArticlesQuery)
  })
  .then((result)=>{
    const articlesRefObject = createRef(result.rows);
    const formattedComments = commentData.map((comment)=> {
    const correctedComment = convertTimestampToDate(comment);
      return [
        articlesRefObject[comment.article_title],
        correctedComment.body,
        correctedComment.votes,
        correctedComment.author,
        correctedComment.created_at
      ];
    });
    const insertCommentQuery = format( `INSERT INTO comments
      (article_id, body, votes, author, created_at) VALUES %L`, formattedComments);
    return db.query(insertCommentQuery);
  })
  .then(()=>{
    console.log("Seed Complete");
  })

};
module.exports = seed;
