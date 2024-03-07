module.exports = (sequelize, Sequelize) =>{
    const ServiceForUser = sequelize.define("service_for_user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, // Đặt trường id là khóa chính
            autoIncrement: true // Tự động tăng giá trị
          },
          user_id:{
            type: Sequelize.INTEGER
          },
          service_id:{
           type: Sequelize.STRING
          },
          status:{
            type: Sequelize.INTEGER
          },
          expiry_date:{
            type: Sequelize.DATE
          },
          name_service:
          {
            type: Sequelize.STRING
          }

          
    })
    return ServiceForUser;
}