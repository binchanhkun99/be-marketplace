const controller = require("../../app/controllers/assets.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/addAssets", controller.addAssets);
  app.post("/api/findAssetsByName", controller.findAssetsByName)
};
