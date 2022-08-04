const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productProvider = require("./productProvider");
const productDao = require("./productDao");
const userProvider = require("../User/userProvider");
const baseResponse = require("../../../config/baseResponseStatus");

const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

exports.createProduct = async function (userIdx, photo, title, categoryIdx, price, content, addressType) {
    try {
        const categoryNum = await productProvider.getProductCategoryNum();
        if (categoryIdx < 1 || categoryIdx > categoryNum.count) return errResponse(baseResponse.OUT_OF_RANGE_CATEGORYIDX);

        if (photo.length > 10) return errResponse(baseResponse.LENGTH_PHOTO);

        if (["address", "subAddress"].indexOf(addressType) < 0) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSTYPE);
        const locationIdx = await userProvider.getUserLocation(userIdx, addressType);

        // Dao Product
        const connection = await pool.getConnection(async (conn) => conn);
        const createProductParams = [locationIdx, title, content, price, userIdx, categoryIdx];
        const createProductResult = await productDao.insertProduct(connection, createProductParams);
        connection.release();

        // Dao Product Photo
        if (photo.length) {
            for (let i in photo) {
                const connection = await pool.getConnection(async (conn) => conn);
                const photoParams = [createProductResult.insertId, photo[i]];
                const photoResult = productDao.insertProductPhoto(connection, photoParams);
                connection.release();
            }
        }

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchPhoto = async function (productIdx, photos) {
    try {
        let updatePhotoParams;
        for (photo of photos) {
            updatePhotoParams = [productIdx, photo];
            const connection = await pool.getConnection(async (conn) => conn);
            const photoResult = await productDao.insertProductPhoto(connection, updatePhotoParams);
            connection.release();
        }
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchPhoto Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchProductTitle = async function (productIdx, title) {
    try {
        const updateTitleParams = [title, productIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const updateTitleResult = await productDao.updateProductTitle(connection, updateTitleParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProductTitle Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchProductCategoryIdx = async function (productIdx, categoryIdx) {
    try {
        const categoryNum = await productProvider.getProductCategoryNum();
        if (categoryIdx < 1 || categoryIdx > categoryNum.count) return errResponse(baseResponse.OUT_OF_RANGE_CATEGORYIDX);

        const ProductCategoryIdx = await productProvider.getProductCategoryIdx(productIdx);
        if (ProductCategoryIdx === categoryIdx) return errResponse(baseResponse.SAME_CATEGORYIDX);

        const updateCategoryParams = [categoryIdx, productIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const updateCategoryResult = await productDao.updateProductCategory(connection, updateCategoryParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProductCategoryIdx Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchProductPrice = async function (productIdx, price) {
    try {
        if (price < 0) return errResponse(baseResponse.OUT_OF_RANGE_PRICE);

        const updatePriceParams = [price, productIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const updatePriceResult = await productDao.updateProductPrice(connection, updatePriceParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProductPrice Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchProductContent = async function (productIdx, content) {
    try {
        const updateContentParams = [content, productIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const updateContentResult = await productDao.updateProductContent(connection, updateContentParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProductContent Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchProductLocation = async function (sellerIdx, productIdx, addressType) {
    try {
        if (["address", "subAddress"].indexOf(addressType) < 0) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSTYPE);
        const locationIdx = await userProvider.getUserLocation(sellerIdx, addressType);

        const updateLocationParams = [locationIdx, productIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const updateLocationResult = await productDao.updateProductLocation(connection, updateLocationParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProductLocation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};