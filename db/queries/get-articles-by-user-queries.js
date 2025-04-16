const db = require("../../db/connection");

function getArticleByUsergrumpy19(){
   return db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`)
   .then((result)=> {
      console.log(result.rows);
   })
}

getArticleByUsergrumpy19();