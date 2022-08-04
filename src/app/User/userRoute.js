module.exports = function (app) {
    const user = require("./userController");
    const iwt = require("../../../config/jwtMiddleware");

    // 1. Sign up
    app.post("/app/users", user.postUsers);

    // 2. Get a user info
    app.get("/app/users/:userId", user.getUserById);

    // 3. Update a user info
    app.patch("/app/users/:userId", iwt, user.patchUsers);

    // 4. Sign in
    app.post("/app/login", user.login);
};