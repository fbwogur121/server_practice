async function postTimeDiff(obj) {
    const createdAt = new Date(obj.createdAt);
    const updatedAt = new Date(obj.updatedAt);
    let when = "";
    const updatedAtSec = Math.round(updatedAt.getTime() / 1000);
    const nowSec = Math.round(new Date().getTime() / 1000);
    const diffSec = nowSec - updatedAtSec;
    if (updatedAtSec < 1000) when += "방금전";
    else if (diffSec < 60) when += `${diffSec}초 전`;
    else if (diffSec < 60 * 60) when += `${Math.floor(diffSec / 60)}분 전`;
    else if (diffSec < 60 * 60 * 24) when += `${Math.floor(diffSec / (60 * 60))}시간 전`;
    else when += `${Math.floor(diffSec / (60 * 60 * 24))}일 전`;

    delete obj.createdAt;
    delete obj.updatedAt;
    obj.when = when;
    return obj;
}

async function productTimeDiff(obj) {
    const createdAt = new Date(obj.createdAt);
    const updatedAt = new Date(obj.updatedAt);
    let when = "";
    if (updatedAt - createdAt > 1) when += "끌올 ";
    const updatedAtSec = Math.round(updatedAt.getTime() / 1000);
    const nowSec = Math.round(new Date().getTime() / 1000);
    const diffSec = nowSec - updatedAtSec;
    if (updatedAtSec < 1000) when += "방금전";
    else if (diffSec < 60) when += `${diffSec}초 전`;
    else if (diffSec < 60 * 60) when += `${Math.floor(diffSec / 60)}분 전`;
    else if (diffSec < 60 * 60 * 24) when += `${Math.floor(diffSec / (60 * 60))}시간 전`;
    else when += `${Math.floor(diffSec / (60 * 60 * 24))}일 전`;

    delete obj.createdAt;
    delete obj.updatedAt;
    obj.when = when;
    return obj;
}

// async function modifyObjs(obj) {
// }

async function modifyObjs(objs, func) {
    if (objs.length === undefined) return func(objs);
    objs.forEach((obj) => func(obj));
    return objs;
}

module.exports = {
    modifyObjs,
    productTimeDiff,
    postTimeDiff,
    //addPostPhotos,
};