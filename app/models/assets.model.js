module.exports = (sequelize, Sequelize) => {
  const Assets = sequelize.define("assets", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // Đặt trường id là khóa chính
      autoIncrement: true, // Tự động tăng giá trị
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    uid_template: {
      type: Sequelize.STRING,
    },
    parents: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
  });
  return Assets;
};
