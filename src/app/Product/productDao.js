// 카테고리 선택
async function selectProductCategories(connection) {
    const selectProductCategoriesQuery = `
                    SELECT *
                    FROM ProductCategories;
                    `;
    const [categoriesResult] = await connection.query(selectProductCategoriesQuery);
    return categoriesResult;
}

// 카테고리 갯수
async function selectProductCategoriesCount(connection) {
    const query = `
                    SELECT count(category) as count
                    FROM ProductCategories;
                    `;
    const [categoriesResult] = await connection.query(query);
    return categoriesResult;
}

//product생성
async function insertProduct(connection, createProductParams) {
    const query = `
                    insert into Product(location, title, content, Price, sellerIdx, category) 
                    VALUE (?, ?, ?, ?, ?, ?);
                    `;
    const [insertProductResult] = await connection.query(query, createProductParams);
    return insertProductResult;
}

// product에 사진등록
async function insertProductPhoto(connection, params) {
    const query = `
                    insert into ProductPhoto(productIdx, photo) 
                    VALUE (?, ?);
                    `;
    const [insertProductPhotoResult] = await connection.query(query, params);
    return insertProductPhotoResult;
}

//
async function selectProductsAddress1(connection, address1Idx) {
    const query = `
                    select p.productIdx,
                            title, 
                            price, 
                            a1.name as location, 
                            p.createdAt as createdAt, 
                            p.updatedAt as updatedAt,
                            p.status,
                            ifnull(photo,'사진없음') as photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    where p.location = ? and p.status = 'Y'
                    group by p.productIdx;
                    `;
    const [selectProductsResult] = await connection.query(query, address1Idx);
    return selectProductsResult;
}
async function selectProductsAddress2(connection, address2Idx) {
    const query = `
                    select p.productIdx, 
                            title, 
                            price, 
                            a1.name as location, 
                            p.createdAt as createdAt, 
                            p.updatedAt as updatedAt,
                            p.status,
                            ifnull(photo,'사진없음') as photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    left join Address2 a2 on a1.address2Idx = a2.address2Idx
                    where a2.address2Idx = ? and p.status = 'Y'
                    group by p.productIdx;
                    `;
    const [selectProductsResult] = await connection.query(query, address2Idx);
    return selectProductsResult;
}
async function selectProductsAddress3(connection, address3Idx) {
    const query = `
                    select p.productIdx,
                            title, 
                            price, 
                            a1.name as location,        
                            p.createdAt as createdAt,
                            p.updatedAt as updatedAt,
                            p.status,
                            ifnull(photo,'사진없음') as photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    left join Address2 a2 on a1.address2Idx = a2.address2Idx
                    left join Address2 a3 on a2.address3Idx = a3.address3Idx
                    where a3.address3Idx = ? and p.status in = 'Y'
                    group by p.productIdx;
                    `;
    const [selectProductsResult] = await connection.query(query, address3Idx);
    return selectProductsResult;
}

async function selectProductStatus(connection, productIdx) {
    const query = `
                    select status
                    from Product
                    where productIdx = ?;
                    `;
    const [selectProductStatusResult] = await connection.query(query, productIdx);
    return selectProductStatusResult;
}
async function selectProductExist(connection, productIdx) {
    const query = `
                    select 
                    exists(
                        select * 
                        from Product 
                        where productIdx = ? and status = 'Y'
                        ) exist;
                    `;
    const [selectProductExistResult] = await connection.query(query, productIdx);
    return selectProductExistResult;
}

async function selectProductInfo(connection, productIdx) {
    const query = `
                    select  p.productIdx,
                            u.userIdx as sellerIdx,
                            u.userNickname as sellerNickname,
                            a1.name as location,
                            c.category,
                            p.title,
                            p.content,
                            p.price,
                            p.createdAt,
                            p.updatedAt,
                            p.status
                    from (  select *
                            from Product
                            where productIdx = ? ) p
                    left join User u on p.sellerIdx = u.userIdx
                    left join Address1 a1 on a1.address1Idx = p.location
                    left join ProductCategories c on c.categoryIdx = p.category;
                    `;
    const [selectProductInfoResult] = await connection.query(query, productIdx);
    return selectProductInfoResult;
}

async function selectProductPhoto(connection, productIdx) {
    const query = `
                    select productPhotoIdx, photo
                    from ProductPhoto
                    where productIdx = ? and status = 'Y';
                    `;
    const [productPhotoResult] = await connection.query(query, productIdx);
    return productPhotoResult;
}

async function updateProductTitle(connection, updateTitleParams) {
    const query = `
                    update Product set title = ?, status ='m' where productIdx = ?;
                    `;
    const [updateProductTitleResult] = await connection.query(query, updateTitleParams);
    return updateProductTitleResult;
}
async function updateProductCategory(connection, updateCategoryParams) {
    const query = `
                    update Product set category = ?, status ='m' where productIdx = ?;
                    `;
    const [updateProductCategoryResult] = await connection.query(query, updateCategoryParams);
    return updateProductCategoryResult;
}
async function updateProductPrice(connection, updatePriceParams) {
    const query = `
                    update Product set price = ?, status ='m' where productIdx = ?;
                    `;
    const [updateProductPriceResult] = await connection.query(query, updatePriceParams);
    return updateProductPriceResult;
}
async function updateProductContent(connection, updateContentParams) {
    const query = `
                    update Product set content = ?, status ='m' where productIdx = ?;
                    `;
    const [updateProductContentResult] = await connection.query(query, updateContentParams);
    return updateProductContentResult;
}
async function updateProductLocation(connection, updateLocationParams) {
    const query = `
                    update Product set location = ?, status ='m' where productIdx = ?;
                    `;
    const [updateProductLocationResult] = await connection.query(query, updateLocationParams);
    return updateProductLocationResult;
}
async function selectProductCategoryIdx(connection, productIdx) {
    const query = `
                    select category
                    from Product
                    where productIdx = ?;
                    `;
    const [productCategoryIdxResult] = await connection.query(query, productIdx);
    return productCategoryIdxResult;
}

async function selectCategoryProductsAddress1(connection, params) {
    const query = `
                    select p.productIdx
                            title, 
                            price, 
                            a1.name as location, 
                            p.createdAt as createdAt, 
                            p.updatedAt as updatedAt,
                            p.status,
                            photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    where a1.address1Idx = ? and p.status in ('Y','m') and p.category = ?
                    group by p.productIdx;
                    `;
    const [ProductsResult] = await connection.query(query, params);
    return ProductsResult;
}
async function selectCategoryProductsAddress2(connection, params) {
    const query = `
                    select p.productIdx, 
                            title, 
                            price, 
                            a1.name as location, 
                            p.createdAt as createdAt, 
                            p.updatedAt as updatedAt,
                            p.status,
                            photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    left join Address2 a2 on a1.address2Idx = a2.address2Idx
                    where a2.address2Idx = ? and p.status in ('Y','m') and p.category = ?
                    group by p.productIdx;
                    `;
    const [insertProductPhotoResult] = await connection.query(query, params);
    return insertProductPhotoResult;
}
async function selectCategoryProductsAddress3(connection, params) {
    const query = `
                    select p.productIdx,
                            title,
                            price,
                            a1.name as location, 
                            p.createdAt as createdAt,
                            p.updatedAt as updatedAt,
                            p.status,
                            photo
                    from Product p
                    left join (
                        select productIdx, photo
                        from ProductPhoto
                        where status = 'Y'
                    ) pp on p.productIdx = pp.productIdx
                    left join Address1 a1 on p.location = a1.address1Idx
                    left join Address2 a2 on a1.address2Idx = a2.address2Idx
                    left join Address3 a3 on a2.address3Idx = a3.address3Idx
                    where a3.address3Idx = ? and p.status in ('Y','m') and p.category = ?
                    group by p.productIdx;
                    `;
    const [insertProductPhotoResult] = await connection.query(query, params);
    return insertProductPhotoResult;
}

//상품조회수
async function selectProductViews(connection, productIdx) {
    const query = `
                    select P.productIdx, PV.count
                    from ProductViews PV
                    left join Product P on PV.productIdx = P.productIdx
                    where P.productIdx = ?;
                `;
    const [selectProductViewsResult] = await connection.query(query, productIdx);
    return selectProductViewsResult;
}

//상품 좋아요수
async function selectProductLikes() {
    const query = `
    
                `;
}

module.exports = {
    selectProductCategories,
    selectProductCategoriesCount,
    insertProduct,
    insertProductPhoto,
    selectProductsAddress1,
    selectProductsAddress2,
    selectProductsAddress3,
    selectProductStatus,
    selectProductExist,
    selectProductInfo,
    selectProductPhoto,
    updateProductTitle,
    updateProductCategory,
    updateProductPrice,
    updateProductContent,
    updateProductLocation,
    selectProductCategoryIdx,
    selectCategoryProductsAddress1,
    selectCategoryProductsAddress2,
    selectCategoryProductsAddress3,
    selectProductViews,
    selectProductLikes,

};