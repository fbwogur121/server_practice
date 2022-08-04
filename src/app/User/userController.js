const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-userEmail");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    console.log('test');
    console.log('test2');
    console.log('test3');
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : sign in 유저 생성(회원가입)
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: id, password, name, nickname, addressIdx, subaddressIdx
     */
    const {id, password, name, nickname, addressIdx} = req.body;

    // 빈 값 체크
    if (!id) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!password) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    //if (!userEmail) return res.send(errResponse(baseResponse.EMPTY_EMAIL));
    if (!name) return res.send(errResponse(baseResponse.EMPTY_NAME));
    if (!nickname) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!addressIdx) return res.send(errResponse(baseResponse.EMPTY_ADDRESSIDX));

    // 길이 체크
    if (id.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (name.length > 30) return res.send(errResponse(baseResponse.LENGTH_NAME));
    if (nickname.length > 30) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userEmail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기

    const signUpResponse = await userService.createUser(id, password, userEmail, name, nickname, addressIdx);

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: userEmail
     */
    const userEmail = req.query.userEmail;

    if (!userEmail) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(userEmail);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
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
        const isIDActive = await userProvider.idActiveCheck(userId);
        if (!isIDActive.active) return res.send(errResponse(baseResponse.NOT_EXIST_ID));

        const userByUserId = await userProvider.retrieveUser(userId);
        return res.send(response(baseResponse.SUCCESS, userByUserId));
    }

};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : id, passsword 
 */
exports.login = async function (req, res) {

    const {id, password} = req.body;
    
    //check empty
    if (!id) return res.send(response(baseResponse.EMPTY_ID));
    if (!password) return res.send(response(baseResponse.EMPTY_PASSWORD));

    // check length
    if (id.length > 20) return res.send(response(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(response(baseResponse.LENGTH_PASSWORD));

    const signInResponse = await userService.postSignIn(id, password);
    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname, password, addressIdx, subAddressIdx, status
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {nickname, password, addressIdx, subAddressIdx, status} = req.body;

    //check ID
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.NOT_MATCHED_TOKEN_ID));
    } else {
        if (!(nickname || password || addressIdx || subAddressIdx || status)) 
            return res.send(errResponse(baseResponse.EMPTY_INFO_TO_UPDATE));

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



/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
