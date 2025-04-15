const db = require("../connection");
const seed = require('./seed');

function queries(){
    return db
    .query(`SELECT * FROM users`)
}

queries();