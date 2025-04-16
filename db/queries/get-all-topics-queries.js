const db = require("../../db/connection");

function getAllTopics(){
   return db.query(`SELECT * FROM topics`)
   .then((result)=>{
      console.log(result.rows);
   })
}

getAllTopics();