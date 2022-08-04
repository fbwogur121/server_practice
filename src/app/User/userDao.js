// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userEmail, userNickname 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUseruserEmail(connection, userEmail) {
  const selectUseruserEmailQuery = `
                SELECT userEmail, userNickname 
                FROM User 
                WHERE userEmail = ?;
                `;
  const [userEmailRows] = await connection.query(selectUseruserEmailQuery, userEmail);
  return userEmailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT userId, userEmail, userNickname 
                 FROM User 
                 WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(userEmail, userPW, userNickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUseruserPW(connection, selectUseruserPWParams) {
  const selectUseruserPWQuery = `
        SELECT userEmail, userNickname, userPW
        FROM User 
        WHERE userEmail = ? AND userPW = ?;`;
  const selectUseruserPWRow = await connection.query(
      selectUseruserPWQuery,
      selectUseruserPWParams
  );

  return selectUseruserPWRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 userId 값도 가져온다.)
async function selectUserAccount(connection, userEmail) {
  const selectUserAccountQuery = `
        SELECT status, userId
        FROM User 
        WHERE userEmail = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userEmail
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, userId, userNickname) {
  const updateUserQuery = `
  UPDATE User 
  SET userNickname = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [userNickname, userId]);
  return updateUserRow[0];
}


module.exports = {
  selectUser,
  selectUseruserEmail,
  selectUserId,
  insertUserInfo,
  selectUseruserPW,
  selectUserAccount,
  updateUserInfo,
};

