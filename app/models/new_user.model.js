module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("new_users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Đặt trường id là khóa chính
        autoIncrement: true // Tự động tăng giá trị
      },
  
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password:{
        type: Sequelize.STRING,
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
      },
      app_name: {
        type: Sequelize.STRING,
      },
      maGioiThieu: {
        type: Sequelize.STRING,
      },
    });
    
    return User;
  };