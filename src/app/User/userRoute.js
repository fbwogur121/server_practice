module.exports = function (app) {
    const user = require("./userController");
    const jwt = require("../../../config/jwtMiddleware");

    // 1. Sign up
    app.post("/app/users", user.postUsers);

    // 2
    app.get("/app/users", user.getUsers);

    // 3. Get a user info
    app.get("/app/users/:userId", user.getUserById);

    // 4. Update a user info
    app.patch("/app/users/:userId", jwt, user.patchUsers);

    // 5. Sign in
    app.post("/app/login", user.login);
};