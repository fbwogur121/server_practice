const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const addresstDao = require("./addressDao");
const userProvider = require("../User/userProvider");
const addressProvier = require("../Address/addressProvider");
const funcs = require("../funcs");

exports.getAddress2From1 = async function (address1Idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoriesResult = await addressDao.selectAddress2From1(connection);
};


exports.getAddress3From1 = async function (address1Idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoriesResult = await addressDao.selectAddress3From1(connection);
};