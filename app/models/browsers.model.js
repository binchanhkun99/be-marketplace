module.exports = (sequelize, Sequelize) => {
    const Browser = sequelize.define("browsers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Đặt trường id là khóa chính
        autoIncrement: true // Tự động tăng giá trị
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      }
    });
    
    return Browser;
  };