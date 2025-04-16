const db = require("../../db/connection");

function getCommentsMoreThanTenVotes(){
    return db.query(`SELECT * FROM comments WHERE votes > 10`)
       .then((result) => {
          console.log(result.rows);
       })
       .catch((err)=> {
          console.log(err);
       })
 }
 getCommentsMoreThanTenVotes();