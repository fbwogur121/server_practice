module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. upload a product
    app.post("/app/products", jwtMiddleware, product.postProduct);
    // 2. get products in range
    // 3. update the product
    // 4. get the product info
    // 5. get product categories
    // 6. get products in the category

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API