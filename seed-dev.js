const db = require("./db/connection");
const seed = require('./db/seeds/seed');


function getAllUsers(){
 return db.query(`SELECT username FROM users`)
 .then((result)=>{
    console.log(result);
 })

}

getAllUsers();
