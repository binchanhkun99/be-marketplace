const { authJwt } = require("../../app/middleware");
const controller = require("../../app/controllers/payment.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // Đảm bảo cả hai đường dẫn đều có hàm gọi lại được truyền vào
    app.post("/api/orders",  [authJwt.checkUser], controller.Order);
    app.post("/api/orders/:orderID/capture", controller.Capture);
    app.get("/api/checkService", [authJwt.checkUserGet], controller.checkService)
}
