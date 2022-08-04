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

// // is exist a user by ID
// async function selectActiveId(connection, userId) {
//   const selectUserStatusQuery = `
//                     select 
//                     exists(
//                         select status 
//                         from User 
//                         where userId = ? and status = 'a'
//                         ) active;
//                   `;
//   const [statusRows] = await connection.query(selectUserStatusQuery, userId);
//   return statusRows;
// }
// // for checking redundant userNickname
// async function selectActiveNickname(connection, userNickname) {
//   const selectUserStatusQuery = `
//                     select 
//                     exists(
//                         select status 
//                         from User 
//                         where userNickname = ? and status = 'a'
//                         ) active;
//                   `;
//   const [statusRows] = await connection.query(selectUserStatusQuery, userNickname);
//   return statusRows;
// }

// // get range of address
// async function selectCountFromAddress1(connection) {
//   const selectCountAddress1Query = `
//                   SELECT count(address1Idx) as count
//                   FROM Address1;
//                   `;
//   const [addressCountResult] = await connection.query(selectCountAddress1Query);
//   return addressCountResult;
// }

// // create a user
// async function insertUserInfo(connection, insertUserInfoParams) {
//   const insertUserInfoQuery = `
//           INSERT INTO User(userId, userPw, userName, userNickname, address)
//           VALUES (?, ?, ?, ?, ?);
//       `;
//   const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
//   return insertUserInfoRow;
// }

// // retrieve a user
// async function selectUserFromId(connection, userId) {
//   const selectUserIdQuery = `
//                    SELECT userNickname, a1.name as location
//                    FROM (
//                         select userNickname, address
//                         from User
//                         where userId = ?
//                         ) u 
//                    JOIN Address1 a1 on u.address = a1.address1Idx;
//                    `;
//   const [userRow] = await connection.query(selectUserIdQuery, userId);
//   return userRow;
// }

// // check PW
// async function selectUseruserPW(connection, userId) {
//   const selectUseruserPWQuery = `
//         SELECT userIdx, userNickname, userPw
//         FROM User
//         WHERE userId = ?;
//           `;
//   const selectUseruserPWRow = await connection.query(selectUseruserPWQuery, userId);
//   return selectUseruserPWRow;
// }

// // 유저 계정 상태 체크 (jwt 생성 위해 userId 값도 가져온다.)
// async function selectUserAccount(connection, userId) {
//   const selectUserAccountQuery = `
//           SELECT status, userId, userIdx
//           FROM User 
//           WHERE userId = ?;
//           `;
//   const selectUserAccountRow = await connection.query(selectUserAccountQuery, userId);
//   return selectUserAccountRow[0];
// }

// // 유저 정보 수정(닉네임)
// async function updateUserNickname(connection, updateNicknameParams) {
//   const updateUserNicknameQuery = `
//         UPDATE User
//           SET userNickname = ?
//           WHERE userId = ?;
//           `;
//   const updateNicknameResult = await connection.query(updateUserNicknameQuery, updateNicknameParams);
//   return updateNicknameResult;
// }
// // 유저 정보 수정(비밀번호)
// async function updateUseruserPW(connection, updateuserPWParams) {
//   const updateUseruserPWQuery = `
//         UPDATE User
//           SET userPw = ?
//           WHERE userId = ?;
//           `;
//   const updateuserPWResult = await connection.query(updateUseruserPWQuery, updateuserPWParams);
//   return updateuserPWResult;
// }
// // 유저 정보 수정(주소)
// async function updateUserAddress(connection, updateAddressParams) {
//   const updateUserAddressQuery = `
//         UPDATE User
//         SET address = ?
//         WHERE userId = ?;
//     `;
//   const updateAddressResult = await connection.query(updateUserAddressQuery, updateAddressParams);
//   return updateAddressResult;
// }
// // 유저 정보 수정(서브 주소)
// async function updateUserSubAddress(connection, updateSubAddressParams) {
//   const updateUserSubAddressQuery = `
//         UPDATE User
//         SET subAddress = ?
//         WHERE userId = ?;
//     `;
//   const updateSubAddressResult = await connection.query(updateUserSubAddressQuery, updateSubAddressParams);
//   return updateSubAddressResult;
// }
// // 유저 정보 수정(상태값)
// async function updateUserStatus(connection, updateStatusParams) {
//   const updateUserStatusQuery = `
//         UPDATE User
//         SET status = ?
//         WHERE userId = ?;
//     `;
//   const updateStatusResult = await connection.query(updateUserStatusQuery, updateStatusParams);
//   return updateStatusResult;
// }

// async function selectUserLocation(connection, userIdx) {
//   const Query = `
//         select address, subAddress
//         from User
//         WHERE userIdx = ?;
//     `;
//   const locationResult = await connection.query(Query, userIdx);
//   return locationResult;
// }

// module.exports = {
//   selectActiveId,
//   selectActiveNickname,
//   selectCountFromAddress1,
//   insertUserInfo,
//   selectUserFromId,
//   selectUseruserPW,
//   selectUserAccount,
//   updateUserNickname,
//   updateUseruserPW,
//   updateUserAddress,
//   updateUserStatus,
//   selectUserLocation,
// };