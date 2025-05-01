const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const express = require("express");
const app = require("../app");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Bad Paths", () => {
  test("GET - 404: not found", () => {
    return request(app)
      .get("/api/notAValidUrl")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid url!");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic object", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object by its ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("400: Bad Request if the article_id is not a number", () => {
    return request(app)
      .get("/api/articles/notANumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: valid but article_id is out of range", () => {
    return request(app)
      .get("/api/articles/1234567")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found!");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: OK if responds with an article array with comment_count property without body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: OK if responds the article sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments ", () => {
  test("200: OK if returns an array for comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([
          {
            comment_id: 16,
            article_id: 6,
            body: "This is a bad article name",
            votes: 1,
            author: "butter_bridge",
            created_at: "2020-10-11T15:23:00.000Z",
          },
        ]);
      });
  });
  test("200: OK if it returns an array of comments for the given article_id if it has numerous comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("200: OK if the array of comments are sorted with the most recent comment first ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSortedBy("created_at");
      });
  });

  // Error Handling

  test("400: Bad Request if the article_id is not a number", () => {
    return request(app)
      .get("/api/articles/NumberInWords/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Not Found when passed a valid article_id but does not exist in the db", () => {
    return request(app)
      .get("/api/articles/5000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found for article_id 5000");
      });
  });

  test("404: Not Found when passed a valid article_id but doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found for article_id 2");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: OK if responds with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test 123!!!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("Test 123!!!");
      });
  });

  // Error Handling

  test("400: Bad Request if the article_id is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test 400!!!",
    };
    return request(app)
      .post("/api/articles/NumberInWords/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Article not Found if the article_id is a valid number but is not present in the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test 404!!!",
    };
    return request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Not Found!");
      });
  });

  test("404: User does not exist", () => {
    const newComment = {
      username: "newUser",
      body: "Test new user 404",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User Not Found!");
      });
  });

  test("400: Bad Request if missing username", () => {
    const newComment = {
      body: "Test no username",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing Username!");
      });
  });

  test("400: Bad Request if missing body", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing Comments!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: OK if responds with the updated article", () => {
    const patchArticle = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(patchArticle)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(1);
        expect(Object.keys(article).length).toBe(8);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("200 : OK responds with the updated article for negative vote value", () => {
    const patchArticle = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchArticle)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(0);
        expect(Object.keys(article).length).toBe(8);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  // Error Handling
  test("400: Bad Request if the article_id is not a number", () => {
    const patchArticle = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/NumberInWords")
      .send(patchArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Bad Request if given vote is not a number", () => {
    const patchArticle = {
      inc_votes: "Twenty",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(patchArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Vote needs to be a number not a string!");
      });
  });

  test("404: Not Found when the article_id passed through is a valid number but is not in the database", () => {
    const patchArticle = {
      inc_votes: 20,
    };
    return request(app)
      .patch("/api/articles/500")
      .send(patchArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article 500 Not Found!");
      });
  });

  test("400: Bad Response when empty object of vote is entered", () => {
    const patchArticle = {};
    return request(app)
      .patch("/api/articles/2")
      .send(patchArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please enter a valid vote!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: No Content after the given comment is deleted by the comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  // Error Handling
  test("400 bad Request when passed through an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Not Found when the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment Not Found!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users[0].username).toBe("butter_bridge");
        expect(users[1].name).toBe("sam");
      });
  });
});

describe("GET SORT BY /api/articles (sorting queries)", () => {
  test("200: OK if article is sort by created_at and descending by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: OK if article is sorted by created_at and asc as a REQUEST", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });

  test("200: OK if article is sorted by votes and asc as a REQUEST", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes");
      });
  });

  test("200: OK if article is sorted by author and desc as a REQUEST", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });

  // Error handling

  test("400: Bad request if invalid sort_by is given", ()=> {
    return request(app)
    .get("/api/articles?sort_by=dog&order=asc")
    .expect(400)
    .then(({body: {msg}})=> {
    expect(msg).toBe("Please enter a valid request!")
    })
  });
  
  test("400: Bad request if invalid order is given", ()=> {
    return request(app)
    .get("/api/articles?sort_by=votes&order=biggestFirst")
    .expect(400)
    .then(({body: {msg}})=> {
      expect(msg).toBe("Please enter a valid request!")
    })
  })
  
});
