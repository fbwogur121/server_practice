// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userId, userNickname 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                SELECT userId, userNickname 
                FROM User 
                WHERE userId = ?;
                `;
  const [userIdRows] = await connection.query(selectUserIdQuery, userId);
  return userIdRows;
}

// is exist a user by ID
async function selectActiveId(connection, id) {
  const selectUserStatusQuery = `
                    select 
                    exists(
                        select status 
                        from User 
                        where userId = ? and status = 'Y'
                        ) active;
                  `;
  const [statusRows] = await connection.query(selectUserStatusQuery, id);
  return statusRows;
}
// for checking redundant nickname
async function selectActiveNickname(connection, nickname) {
  const selectUserStatusQuery = `
                    select 
                    exists(
                        select status 
                        from User 
                        where userNickname = ? and status = 'Y'
                        ) active;
                  `;
  const [statusRows] = await connection.query(selectUserStatusQuery, nickname);
  return statusRows;
}

// get range of address
async function selectCountFromAddress1(connection) {
  const selectCountAddress1Query = `
                  SELECT count(address1Idx) as count
                  FROM Address1;
                  `;
  const [addressCountResult] = await connection.query(selectCountAddress1Query);
  return addressCountResult;
}

// create a user
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
          INSERT INTO User(userId, userPw, userName, userNickname, address)
          VALUES (?, ?, ?, ?, ?);
      `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRow;
}

// retrieve a user
async function selectUserFromId(connection, userId) {
  const selectUserIdQuery = `
                   SELECT userNickname, a1.name as location
                   FROM (
                        select userNickname, address
                        from User
                        where userId = ?
                        ) u 
                   JOIN Address1 a1 on u.address = a1.address1Idx;
                   `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// check PW
async function selectUserPassword(connection, userId) {
  const selectUserPasswordQuery = `
        SELECT userIdx, userNickname, userPw
        FROM User
        WHERE userId = ?;
          `;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery, userId);
  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, id) {
  const selectUserAccountQuery = `
          SELECT status, userId, userIdx
          FROM User 
          WHERE userId = ?;
          `;
  const selectUserAccountRow = await connection.query(selectUserAccountQuery, id);
  return selectUserAccountRow[0];
}

// 유저 정보 수정(닉네임)
async function updateUserNickname(connection, updateNicknameParams) {
  const updateUserNicknameQuery = `
        UPDATE User
          SET userNickname = ?
          WHERE userId = ?;
          `;
  const updateNicknameResult = await connection.query(updateUserNicknameQuery, updateNicknameParams);
  return updateNicknameResult;
}
// 유저 정보 수정(비밀번호)
async function updateUserPassword(connection, updatePasswordParams) {
  const updateUserPasswordQuery = `
        UPDATE User
          SET userPw = ?
          WHERE userId = ?;
          `;
  const updatePasswordResult = await connection.query(updateUserPasswordQuery, updatePasswordParams);
  return updatePasswordResult;
}
// 유저 정보 수정(주소)
async function updateUserAddress(connection, updateAddressParams) {
  const updateUserAddressQuery = `
        UPDATE User
        SET address = ?
        WHERE userId = ?;
    `;
  const updateAddressResult = await connection.query(updateUserAddressQuery, updateAddressParams);
  return updateAddressResult;
}
// 유저 정보 수정(서브 주소)
async function updateUserSubAddress(connection, updateSubAddressParams) {
  const updateUserSubAddressQuery = `
        UPDATE User
        SET subAddress = ?
        WHERE userId = ?;
    `;
  const updateSubAddressResult = await connection.query(updateUserSubAddressQuery, updateSubAddressParams);
  return updateSubAddressResult;
}
// 유저 정보 수정(상태값)
async function updateUserStatus(connection, updateStatusParams) {
  const updateUserStatusQuery = `
        UPDATE User
        SET status = ?
        WHERE userId = ?;
    `;
  const updateStatusResult = await connection.query(updateUserStatusQuery, updateStatusParams);
  return updateStatusResult;
}

async function selectUserLocation(connection, userIdx) {
  const Query = `
        select address, subAddress
        from User
        WHERE userIdx = ?;
    `;
  const locationResult = await connection.query(Query, userIdx);
  return locationResult;
}

module.exports = {
  selectUser,

  selectActiveId,
  selectUserId,
  selectActiveNickname,
  selectCountFromAddress1,
  insertUserInfo,
  selectUserFromId,
  selectUserPassword,
  selectUserAccount,
  updateUserNickname,
  updateUserPassword,
  updateUserAddress,
  updateUserStatus,
  selectUserLocation,
};