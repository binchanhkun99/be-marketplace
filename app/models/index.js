const config = require("../config/db.config.js");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: Op,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.notify_global = require("../models/notify_global.model.js")(sequelize, Sequelize);
db.assets = require("../models/assets.model.js")(sequelize, Sequelize)
db.Service = require("../models/service.model.js")(sequelize, Sequelize)
db.ServiceForUser = require("../models/service_for_user.model.js")(sequelize, Sequelize)
db.NewUsers = require("../models/new_user.model.js")(sequelize, Sequelize)
db.Extensions =  require("../models/extensions.model.js")(sequelize, Sequelize)
db.SerCus = require("../models/service_customers.model.js")(sequelize, Sequelize)
db.Category = require("../models/category.model.js")(sequelize, Sequelize)
db.Types = require("../models/types.model.js")(sequelize, Sequelize)
db.PayHis = require("../models/pay_history.model.js")(sequelize, Sequelize)
db.Browser = require("../models/browsers.model.js")(sequelize, Sequelize)
// // Xóa cache của mô hình
// db.Extensions.clearCache();
// db.Service.clearCache();
// Xóa cache của sequelize instance
// sequelize.clearCache();
// db.role.belongsToMany(db.user, {
//   through: "user_roles",
//   foreignKey: "roleId",
//   otherKey: "userId"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });

db.Service.belongsTo(db.Extensions, { foreignKey: 'id_extension', as: 'id_est' });
db.SerCus.belongsTo(db.Service, { foreignKey: 'id_service', as: 'id_servi' });


module.exports = db;
