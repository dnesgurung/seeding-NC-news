const db = require("../../db/connection");

function getCommentsLessThanZero(){
   return db.query(`SELECT * FROM comments WHERE votes < 0`)
   .then((result) => {
      console.log(result.rows);
   })
   .catch((err)=> {
      console.log(err);
   })
}

getCommentsLessThanZero();