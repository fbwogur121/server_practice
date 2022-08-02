module.exports = {

    // // Success
    // SUCCESS : { "isSuccess": true, "code": 100, "message":"성공" },
    
    // // Common
    // TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    // TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    // TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    // //Request error
    // SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    // SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    // SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    // SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    // SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    // SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    // SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    // SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    // SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    // SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    // SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    // USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    // USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    // USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    // USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    // USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    // USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    // USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // // Response error
    // SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    // SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    // SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    // SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    // SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    // SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    // //Connection, Transaction 등의 서버 오류
    // DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    // SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    
    
    
    // 2XX : Success
    SUCCESS: { isSuccess: true, code: 200, message: "Successed" },

    // 3xx : form validation error
    EMPTY_ID: { isSuccess: true, code: 300, message: "ID is required." },
    EMPTY_PASSWORD: { isSuccess: true, code: 301, message: "Password is required." },
    EMPTY_NAME: { isSuccess: true, code: 302, message: "User name is required." },
    EMPTY_NICKNAME: { isSuccess: true, code: 303, message: "User nickname is required." },
    EMPTY_ADDRESSIDX: { isSuccess: true, code: 304, message: "AddressIdx is required." },
    EMPTY_ADDRESSTYPE: { isSuccess: true, code: 305, message: "Address type is required." },
    EMPTY_INFO_TO_UPDATE: { isSuccess: true, code: 306, message: "There is no info to update." },
    EMPTY_TITLE: { isSuccess: true, code: 307, message: "Title is required." },
    EMPTY_CATEGORYIDX: { isSuccess: true, code: 308, message: "CategoryIdx is required." },
    EMPTY_CONTENT: { isSuccess: true, code: 309, message: "Content is required." },
    EMPTY_SEARCH_RANGE: { isSuccess: true, code: 310, message: "Range is required." },

    LENGTH_ID: { isSuccess: true, code: 307, message: "User ID should be shorter then 20 charaters." },
    LENGTH_PASSWORD: { isSuccess: true, code: 308, message: "User password should be longer than 6 and shorter then 20 charaters." },
    LENGTH_NAME: { isSuccess: true, code: 309, message: "User name should be shorter then 24 charaters." },
    LENGTH_NICKNAME: { isSuccess: true, code: 310, message: "User name should be shorter then 24 charaters." },
    LENGTH_PHOTO: { isSuccess: true, code: 310, message: "Photos can be uploaded less than 10 photos" },

    // 4xx : value validation error
    REDUNDANT_ID: { isSuccess: false, code: 401, message: "It is a redundant ID." },
    REDUNDANT_NICKNAME: { isSuccess: false, code: 402, message: "It is a redundant nickname." },

    OUT_OF_RANGE_ADDRESSIDX: { isSuccess: false, code: 403, message: "It is not in range of addressIdx." },
    OUT_OF_RANGE_ADDRESSTYPE: { isSuccess: false, code: 404, message: "Address type should be 'address' or 'subAddress'." },
    OUT_OF_RANGE_USER_STATUS: { isSuccess: false, code: 405, message: "It is not in list of user status." },
    OUT_OF_RANGE_SEARCH_RANGE: { isSuccess: false, code: 406, message: "Range should be 1 or 2 or 3." },
    OUT_OF_RANGE_CATEGORYIDX: { isSuccess: false, code: 407, message: "CategoryIdx is out of range." },
    OUT_OF_RANGE_PRICE: { isSuccess: false, code: 408, message: "Price can not be a negative number." },

    NOT_EXIST_ID: { isSuccess: false, code: 405, message: "This ID is not exist." },
    NOT_EXIST_PRODUCT: { isSuccess: false, code: 406, message: "This product is not exist." },

    USER_STATUS_INACTIVE: { isSuccess: false, code: 406, message: "This account is inactive." },
    USER_STATUS_WITHDRAWAL: { isSuccess: false, code: 407, message: "This account has been withdrawn." },

    PRODUCT_STATUS_NOT_ON_SALE: { isSuccess: false, code: 408, message: "This product is not on sale." },
    PRODUCT_STATUS_DELETED: { isSuccess: false, code: 409, message: "This product is deleted." },
    PRODUCT_STATUS_SOLD_OUT: { isSuccess: false, code: 410, message: "This product is sold out." },

    NOT_MATCHED_TOKEN_ID: { isSuccess: false, code: 408, message: "Tocken and user ID are not matched." },
    NOT_MATCHED_PASSWORD: { isSuccess: false, code: 409, message: "It's wrong password." },
    NOT_MATCHED_PRODUCT_WRITER_ID: { isSuccess: false, code: 409, message: "It is not writer's ID" },

    SAME_PASSWORD: { isSuccess: false, code: 410, message: "It's the same password." },
    SAME_STATUS: { isSuccess: false, code: 411, message: "It's the same status." },
    SAME_CATEGORYIDX: { isSuccess: false, code: 411, message: "It's the same categoryIdx." },

    // 5XX : server error such as Connection, Transaction ...
    DB_ERROR: { isSuccess: false, code: 500, message: "Database Error" },
    SERVER_ERROR: { isSuccess: false, code: 501, message: "Server Error" },
 
}
