module.exports = (sequelize, Sequelize) => {
    const PayHis = sequelize.define("pay_histories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Đặt trường id là khóa chính
        autoIncrement: true // Tự động tăng giá trị
      },
      id_service_customers: {
        type: Sequelize.INTEGER,
      },
      money: {
        type: Sequelize.STRING,
      },
      last_time: {
        type: Sequelize.STRING,
      },
      pay_content: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      }
    });
    
    return PayHis;
  };