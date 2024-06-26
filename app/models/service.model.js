module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define("servicesex", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Đặt trường id là khóa chính
        autoIncrement: true // Tự động tăng giá trị
      },
      id_extension: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
    });
    
    return Service;
  };