const db = require("../../db/connection");

function getCodingArticles(){
return db.query(`SELECT * FROM articles WHERE topic = 'coding' `)
.then((result)=> {
  console.log('Articles with Coding', result.rows);;
})
.catch((err) => {
   console.log(err);
})
}

getCodingArticles();