const jwtMiddleware = require("../../../config/jwtMiddleware");
const addressProvider = require("../../app/Address/addressProvider");
const addressService = require("../../app/Address/addressService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//address 목록 조회하기

//특정 유저의 address1, 2 조회

//