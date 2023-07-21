const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'ron-db.c5xjal4juaz2.ap-northeast-2.rds.amazonaws.com',
    user: 'master',
    port: '3306',
    password: 'wogur121!!',
    database: 'ronDB'
});

module.exports = {
    pool: pool
};