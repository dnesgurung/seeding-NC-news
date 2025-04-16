const db = require("../../db/connection");

function getAllUsers(){
 return db.query(`SELECT * FROM users`)
 .then((result)=>{
   console.log('All the users', result.rows);
 })
 .catch((err)=>{
    console.log(err);
 })

}

getAllUsers();