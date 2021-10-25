const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection (
    {
        host:'localhost',
        user:'root',
        password:'budnova2021',
        database: 'friends_db'
    },
    console.log('Connected to the friends_db database.')
);

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;