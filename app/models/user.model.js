module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // Đặt trường id là khóa chính
      autoIncrement: true // Tự động tăng giá trị
    },
    sub: {
      type: Sequelize.STRING,
    },
    picture: {
      type: Sequelize.STRING,
    },

    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    email_verified:{
      type: Sequelize.ENUM('true', 'false'),
    },
    status:{
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    type: {
      type: Sequelize.STRING,
    }, 
    access_token: {
      type: Sequelize.STRING,
    }
  });
  
  return User;
};