const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const productDao = require("./productDao");
const userProvider = require("../User/userProvider");
//const addressProvier = require("../Address/addressProvider");
const funcs = require("../funcs");

exports.provideProductCategories = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoriesResult = await productDao.selectProductCategories(connection);
    connection.release();
    return categoriesResult;
};

exports.getProductCategoryNum = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoriesResult = await productDao.selectProductCategoriesCount(connection);
    connection.release();
    return categoriesResult[0];
};

exports.getProductsInRange = async function (userIdx, addressType, range) {
    const address1Idx = await userProvider.getUserLocation(userIdx, addressType);

    let getProductsResult;

    const connection = await pool.getConnection(async (conn) => conn);
    switch (parseInt(range)) {
        case 1:
            getProductsResult = await productDao.selectProductsAddress1(connection, address1Idx);
            break;
        case 2:
            const address2 = await addressProvier.getAddress2From1(address1Idx);
            getProductsResult = await productDao.selectProductsAddress2(connection, address2.address2Idx);
            break;
        default:
            const address3 = await addressProvier.getAddress3From1(address1Idx);
            getProductsResult = await productDao.selectProductsAddress3(connection, address3.address3Idx);
    }
    connection.release();
    await funcs.modifyObjs(getProductsResult, funcs.productTimeDiff);

    return getProductsResult;
};

exports.checkProductStatus = async function (productIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productStatusResult = await productDao.selectProductStatus(connection, productIdx);
    connection.release();
    return productStatusResult[0];
};
exports.checkProductExist = async function (productIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productExistResult = await productDao.selectProductExist(connection, productIdx);
    connection.release();
    return productExistResult[0];
};

exports.getProductInfo = async function (productIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productStatusResult = await productDao.selectProductInfo(connection, productIdx);
    connection.release();

    await funcs.modifyObjs(productStatusResult[0], funcs.productTimeDiff);

    return productStatusResult[0];
};

exports.getProductPhotos = async function (productIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productPhotoResult = await productDao.selectProductPhoto(connection, productIdx);
    connection.release();

    return productPhotoResult;
};

exports.getProductCategoryIdx = async function (productIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productCategoryResult = await productDao.selectProductCategoryIdx(connection, productIdx);
    connection.release();

    return productCategoryResult[0].category;
};

exports.getCategoryProductsInRange = async function (userIdx, addressType, range, categoryIdx) {
    const address1Idx = await userProvider.getUserLocation(userIdx, addressType);

    let categoryProductsResult;
    let params;

    const connection = await pool.getConnection(async (conn) => conn);
    switch (parseInt(range)) {
        case 1:
            params = [address1Idx, categoryIdx];
            categoryProductsResult = await productDao.selectCategoryProductsAddress1(connection, params);
            break;
        case 2:
            const address2 = await addressProvier.getAddress2From1(address1Idx);
            params = [address2.address2Idx, categoryIdx];
            categoryProductsResult = await productDao.selectCategoryProductsAddress2(connection, params);
            break;
        default:
            const address3 = await addressProvier.getAddress3From1(address1Idx);
            params = [address3.address3Idx, categoryIdx];
            categoryProductsResult = await productDao.selectCategoryProductsAddress3(connection, params);
    }
    connection.release();

    await funcs.modifyObjs(categoryProductsResult, funcs.productTimeDiff);
    return categoryProductsResult;
};