module.exports = (sequelize, Sequelize) => {
    const SerCus = sequelize.define("service_customers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Đặt trường id là khóa chính
        autoIncrement: true // Tự động tăng giá trị
      },
      id_users: {
        type: Sequelize.INTEGER,
      },
      register_date: {
        type: Sequelize.STRING,
      },
      expiration_date: {
        type: Sequelize.STRING,
      },
      id_service: {
        type: Sequelize.INTEGER,
      }
    });
    
    return SerCus;
  };