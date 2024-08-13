const mysql = require('mysql2');

class UsersModel {
    constructor(db) {
        this.db = db;
    }

    generateCustomId() {
        const timestamp = Date.now(); // Current timestamp in milliseconds
        return `USR_${timestamp}`;    // Generates IDs like USR_1638472992384
    }


    createUser(name, email, callback) {
        const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
        this.db.query(query, [name, email], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    }

    loginUser(email,callback){
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        this.db.query(query,[email], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results.length === 0) {
                return callback(null, null); // No user found
            }
    
            callback(null, results[0]);
        });
    }    

    getAllUsers(callback) {
        const query = 'SELECT * FROM users';
        this.db.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
}

module.exports = UsersModel;

