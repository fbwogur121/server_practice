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
     * Body: id, password, name, email, nickname, addressIdx, subAddressIdx
     */
    const { id, password, name, email, nickname, addressIdx, subAddressIdx } = req.body;

    // check empty value
    if (!id) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!password) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    if (!name) return res.send(errResponse(baseResponse.EMPTY_NAME));
    if (!email) return res.send(errResponse(baseResponse.EMPTY_EMAIL));
    if (!nickname) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!addressIdx) return res.send(errResponse(baseResponse.EMPTY_ADDRESSIDX));
    if (!subAddressIdx) return res.send(errResponse(baseResponse.EMPTY_SUBADDRESSIDX));

    // check length of value
    if (id.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (name.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));
    if (nickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

    const signUpResponse = await userService.createUser(id, password, name, email, nickname, addressIdx, subAddressIdx);

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 아이디로 검색 조회)
 * [GET] /app/users
 */
 exports.getUsers = async function (req, res) {

    /**
     * Query String: userId
     */
    const userId = req.query.userId;

    if (!userId) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByuserId = await userProvider.retrieveUserList(userId);
        return res.send(response(baseResponse.SUCCESS, userListByuserId));
    }
};

/**
 * API No. 3
 * - Get a user
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 4
 * - update user info
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body :  nickname, password, addressIdx, subAddressIdx, status
 */
exports.patchUsers = async function (req, res) {
    // jwt - userId, path variable :userId
    console.log("1");
    const userIdFromJWT = req.verifiedToken.userId;
    
    const userId = req.params.userId;
    const { nickname, password, addressIdx, subAddressIdx, status } = req.body;
    console.log(req.body);
    
    // check ID
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));

    // jwt
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.NOT_MATCHED_TOKEN_ID));
    } else {
        const patchResponse = {};
        if (!(nickname || password || addressIdx || subAddressIdx || status)) return res.send(errResponse(baseResponse.EMPTY_INFO_TO_UPDATE));
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
 * API No. 5
 * - login
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {
    const { email, password } = req.body;
    // check empty
    if (!email) return res.send(response(baseResponse.EMPTY_EMAIL));
    if (!password) return res.send(response(baseResponse.EMPTY_PASSWORD));

    // check length
    if (password.length > 300 || password.length < 6) return res.send(response(baseResponse.LENGTH_PASSWORD));

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};