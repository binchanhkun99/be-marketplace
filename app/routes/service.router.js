const { authJwt } = require("../../app/middleware");
const controller = require("../../app/controllers/service.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // Đảm bảo cả hai đường dẫn đều có hàm gọi lại được truyền vào
    app.post("/api/addService_6x9f5umtm", controller.addService_6x9f5umtm);
}
