const { authJwt } = require("../../app/middleware");
const controller = require("../../app/controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //Get info user
  app.get("/api/user/getUser", [authJwt.verifyToken], controller.getInfo);

  //Forgot password
  app.post("/api/user/forgot_passowrd", controller.forget_password);

  //Check user for payment
  app.post("/api/user/checkUser", controller.checkUser)
};
