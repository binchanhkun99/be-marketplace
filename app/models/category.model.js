module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
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
    
    return Category;
  };