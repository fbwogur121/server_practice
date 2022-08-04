module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. upload a product X
    app.post("/app/products", jwtMiddleware, product.postProduct);
    // 2. get products in range
    app.get("/app/products", jwtMiddleware, product.getProducts);
    // 3. update the product
    app.patch("/app/products/:productIdx", jwtMiddleware, product.patchProduct);
    // 4. get the product info
    app.get("/app/products/:productIdx", jwtMiddleware, product.getProduct);
    // 5. get product categories X
    app.get("/app/product-categories", product.getProductCategories);
    // 6. get products in the category
    app.get("/app/products/categories/:categoryIdx", jwtMiddleware, product.getCategoryProducts);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API