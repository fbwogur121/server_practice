const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 *  API No.1
 *  - sign up
 *  [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    /**
     * Body: id, password, name, nickname, addressIdx, subAddressIdx
     */
    const { id, password, name, nickname, addressIdx } = req.body;

    // check empty value
    if (!id) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!password) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!name) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    if (!nickname) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!addressIdx) return res.send(errResponse(baseResponse.EMPTY_ADDRESSIDX));

    // check length of value
    if (id.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (name.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));
    if (nickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

    const signUpResponse = await userService.createUser(id, password, name, nickname, addressIdx);

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * - Get a user
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {
    /**
     * Path Variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    // jwt
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.NOT_MATCHED_TOKEN_ID));
    } else {
        // check ID empty and length
        if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
        if (userId.length > 20) return res.send(response(baseResponse.LENGTH_ID));

        // check ID status
        const isIdActive = await userProvider.idActiveCheck(userId);
        if (!isIdActive.active) return res.send(errResponse(baseResponse.NOT_EXIST_ID));

        const userByUserId = await userProvider.retrieveUser(userId);
        return res.send(response(baseResponse.SUCCESS, userByUserId));
    }
};

/**
 * API No. 3
 * - update user info
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname, password, addressIdx, status
 */
exports.patchUsers = async function (req, res) {
    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    const { nickname, password, addressIdx, subAddressIdx, status } = req.body;

    // check ID
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));

    // jwt
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.TOKEN_ID_NOT_MATCH));
    } else {
        const patchResponse = {};
        if (!(nickname || password || addressIdx || subAddressIdx || status)) return res.send(errResponse(baseResponse.EMPTY_INFO_TO_PATCH));
        if (nickname) {
            const patchNicknameResponse = await userService.patchNickname(userId, nickname);
            patchResponse.nickname = patchNicknameResponse;
        }
        if (password) {
            const patchPasswordResponse = await userService.patchPassword(userId, password);
            patchResponse.password = patchPasswordResponse;
        }
        if (addressIdx) {
            const patchAddressIdxResponse = await userService.patchAddressIdx(userId, addressIdx);
            patchResponse.addressIdx = patchAddressIdxResponse;
        }
        if (subAddressIdx) {
            const patchSubAddressIdxResponse = await userService.patchSubAddressIdx(userId, subAddressIdx);
            patchResponse.SubAddressIdx = patchSubAddressIdxResponse;
        }
        if (status) {
            const patchStatusResponse = await userService.patchStatus(userId, status);
            patchResponse.status = patchStatusResponse;
        }

        return res.send(response(baseResponse.SUCCESS, patchResponse));
    }
};

/**
 * API No. 4
 * - login
 * [POST] /app/login
 * body : userId, passsword
 */
exports.login = async function (req, res) {
    const { id, password } = req.body;

    // check empty
    if (!id) return res.send(response(baseResponse.EMPTY_ID));
    if (!password) return res.send(response(baseResponse.EMPTY_PASSWORD));

    // check length
    if (id.length > 20) return res.send(response(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(response(baseResponse.LENGTH_PASSWORD));

    const signInResponse = await userService.postSignIn(id, password);

    return res.send(signInResponse);
};