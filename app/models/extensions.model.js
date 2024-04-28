module.exports = (sequelize, Sequelize) => {
  const Extensions = sequelize.define("extensions", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // Đặt trường id là khóa chính
      autoIncrement: true, // Tự động tăng giá trị
    },
    title: {
      type: Sequelize.STRING,
    },
    slug: {
      type: Sequelize.STRING,
    },

    app_name: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    slider: {
      type: Sequelize.STRING,
    },

    zip: {
      type: Sequelize.STRING,
    },
    store: {
      type: Sequelize.STRING,
    },
    download: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    post: {
      type: Sequelize.STRING,
    },

    id_category: {
      type: Sequelize.INTEGER,
    },
    id_browser: {
      type: Sequelize.INTEGER,
    },

    id_type: {
      type: Sequelize.INTEGER,
    },
  });

  return Extensions;
};
