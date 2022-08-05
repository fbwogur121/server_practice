const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Sign up
exports.createUser = async function (id, password, name, email, nickname, addressIdx, subAddressIdx) {
    console.log("kkk");
    try {
        // check redundatn ID
        const isIdActive = await userProvider.idActiveCheck(id);
        if (isIdActive.active) return errResponse(baseResponse.REDUNDANT_ID);

        // check redundatn PW
        const isNicknameActive = await userProvider.nicknameActiveCheck(nickname);
        if (isNicknameActive.active) return errResponse(baseResponse.REDUNDANT_NICKNAME);

        // hash PW
        const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

        // check redudant email
        const isEmailActive = await userProvider.emailActiveCheck(email);
        if (isEmailActive.active) return errResponse(baseResponse.REDUNDANT_EMAIL);

        // check address range
        const addressCount = await userProvider.countAddress1();
        if (addressIdx > addressCount.count || addressIdx < 0) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSIDX);
        const subAddressCount = await userProvider.countAddress1();
        if (subAddressIdx > subAddressCount.count || subAddressIdx < 0) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSIDX);

        // save hashedPW
        const insertUserInfoParams = [id, hashedPassword, name, email, nickname, addressIdx, subAddressIdx];

        const connection = await pool.getConnection(async (conn) => conn);

        // save
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`Added User : ${userIdResult[0].insertId}`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// // login
// exports.postSignIn = async function (email, password) {
//     try {
//         console.log("3-1");
//         // 계정 상태 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) {
//             return errResponse(baseResponse.NOT_EXIST_EMAIL);
//         }
//         console.log("3-2");
//         const selectEmail = emailRows[0].email;

//         console.log("3-3");
//         // hash PW
//         const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

//         const selectUserPasswordParams = [selectEmail, hashedPassword];

//         console.log("3-6");
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(id);
//         if (userInfoRows[0].status === "N") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "D") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }

//         console.log("3-4");
//         // check PW
//         const passwordRows = await userProvider.passwordCheck(userInfoRows[0].userId);

//         console.log("3-5");
//         if (passwordRows[0].userPw !== hashedPassword) {
//             return errResponse(baseResponse.NOT_MATCHED_PASSWORD);
//         }

//         console.log("3-7");
//         console.log(userInfoRows[0].id) // DB의 userId

//         console.log("3-8");
//         // create token
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].userId,
//                 userIdx: userInfoRows[0].userIdx,
//             }, // payload
//             secret_config.jwtsecret, // secret key
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             }
//         );
//         console.log("3-9");
//         return response(baseResponse.SUCCESS, { userId: userInfoRows[0].userId, jwt: token });
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.NOT_EXIST_EMAIL);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchNickname = async function (userId, nickname) {
    try {
        // nickname length
        if (nickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

        // nickname redundant
        const isNicknameActive = await userProvider.nicknameActiveCheck(nickname);
        if (isNicknameActive.active) return errResponse(baseResponse.REDUNDANT_NICKNAME);

        // Dao
        const connection = await pool.getConnection(async (conn) => conn);
        const updateNicknameParams = [nickname, userId];
        const updateNicknameResult = await userDao.updateUserNickname(connection, updateNicknameParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchNickname Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchPassword = async function (userId, password) {
    try {
        //password validation
        if (password.length > 20 || password.length < 6) return errResponse(baseResponse.LENGTH_PASSWORD);

        // hash PW
        const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

        const userPasswordRows = await userProvider.passwordCheck(userId);
        if (userPasswordRows[0].userPw === hashedPassword) {
            return errResponse(baseResponse.SAME_PASSWORD);
        }

        // Dao
        const connection = await pool.getConnection(async (conn) => conn);
        const updatePasswordParams = [hashedPassword, userId];
        const updatePasswordResult = await userDao.updateUserPassword(connection, updatePasswordParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchPassword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchAddressIdx = async function (userId, addressIdx) {
    try {
        // address validation
        const maxAddIdx = await userProvider.countAddress1();
        if (addressIdx > maxAddIdx.count || addressIdx < 1) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSIDX);

        // Dao
        const connection = await pool.getConnection(async (conn) => conn);
        const updateAddressParams = [addressIdx, userId];
        const updateAddressResult = await userDao.updateUserAddress(connection, updateAddressParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchAddressIdx Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.patchSubAddressIdx = async function (userId, subAddressIdx) {
    try {
        // address validation
        const maxAddIdx = await userProvider.countAddress1();
        if (subAddressIdx > maxAddIdx.count || subAddressIdx < 1) return errResponse(baseResponse.OUT_OF_RANGE_ADDRESSIDX);

        // Dao
        const connection = await pool.getConnection(async (conn) => conn);
        const updateSubAddressParams = [subAddressIdx, userId];
        const updateSubAddressResult = await userDao.updateUserAddress(connection, updateSubAddressParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchSubAddressIdx Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchStatus = async function (userId, status) {
    try {
        // status validation
        const statusArray = ["a", "i", "d"];
        const statusValidation = statusArray.some((element) => status === element);
        if (!statusValidation) return errResponse(baseResponse.OUT_OF_RANGE_USER_STATUS);

        const userInfoRows = await userProvider.accountCheck(userId);
        if (userInfoRows[0].status === status) return errResponse(baseResponse.SAME_STATUS);

        // Dao
        const connection = await pool.getConnection(async (conn) => conn);
        const updateStatusParams = [status, userId];
        const updateStatusResult = await userDao.updateUserStatus(connection, updateStatusParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};