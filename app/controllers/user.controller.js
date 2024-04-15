const db = require("../../app/models");
const config = require("../config/auth.config");;
const _ = require("lodash");
const nodemailer = require("nodemailer");
const User = db.user;
const urlApp = db.url_app;
const Order = db.order_history
const Service = db.Service



const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getUserAndService = async (req, res) =>{
  try {
  const email = req.body.data[0].email
  const nameService = req.body.data[0].id
  const dataUser = await User.findOne({
    where:{
      email: email
    }
  })
  const dataService = await Service.findOne({
    where:{
      name: nameService
    }
  })
  const filteredResults = {
    price: dataService.price,
    nameExt: dataUser.type
  }
  
  res.status(200).json({ success: true, filteredResults });
  } catch (error) {
    res.status(500).send({ success: false });
  }
  
}     

exports.getInfo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header Authorization

    // Giải mã token và lấy thông tin từ payload
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("INVALID_USER");
    }

    const responseData = {
      id: userId,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      transferCode: user.transferCode,
      securityCode: user.securityCode,
      status: user.status,
      success: true,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.checkUser = async (req, res) =>{
  try {
    const {email, access_token} = req.body
    const user = await User.findOne({
      where: {
        email: email,
        access_token: access_token
      }
    });
    if (user) {
      // Nếu tìm thấy user, gửi phản hồi với thông báo thành công
      return res.status(200).json({ success: true, message: "User exists" });
    } else {
      // Nếu không tìm thấy user, gửi phản hồi với thông báo không thành công
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}




//Thống kê 

exports.thongke = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header Authorization

  // Giải mã token và lấy thông tin từ payload
  const decodedToken = jwt.verify(token, config.secret);
  const userId = decodedToken.id;
  //Lấy thời điểm hiện tại
  const currentTime = new Date();
  console.log("currentTime________________>",currentTime)

  //Thêm thời gian bắt đầu thống kê
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  // startOfToday.setHours(startOfToday.getHours() + 7);
  console.log("startOfToday>",startOfToday)
  Order.sum("profit", 
  {
    where: {
      user_id: userId, // Thay userId bằng ID của người dùng cần tính lợi nhuận
      createdAt: {
        [Op.between]: [startOfToday, currentTime],
      },
    },
  }).then(totalProfit =>{
    return res
      .status(200)
      .json({
        success: true,
        profit: totalProfit,
      });
  })


}

exports.forget_password = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra Email 
  const user = await User.findOne({
    where: {
      email: email,
    }
  });
  if (!user) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Lỗi cmnr khách hàng ơi, bạn vui lòng kiểm tra lại giùm mình nhé",
      });
  }
  // Tạo một đối tượng vận chuyển (transporter) để cấu hình cách gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",//Tính sau nha bạn
      pass: "",
    },
  });
  let newPassword = "";
  let code = "";
  const characters = "abcdefghikjlmnopqrstuvwxyz0123456789";
  const codeLength = 7;
  // Tạo một chuỗi ngẫu nhiên với độ dài bằng codeLength
  const potentialCode = Array.from(
    { length: codeLength },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
  code = potentialCode;
  newPassword = code;



  //Cập nhật mật khẩu mới theo newPassword
  // Cập nhật mật khẩu mới trong bảng User
  user.password =  bcrypt.hashSync(newPassword, 8);
  await user.save();



  // Định nghĩa các thuộc tính của email (người gửi, người nhận, tiêu đề, nội dung...)
  const mailOptions = {
    from: "",
    to: `${emailUser}`,
    subject: "Mật khẩu mới",
    text: "Xin chào, Dưới đây là mật khẩu mới của bạn",
    html: `Mật khẩu mới của bạn là <b> ${newPassword}</b> vui lòng không để lộ mật khẩu mới của bạn cho bất ký ai</b>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Gửi email thất bại: ' + error);
      return res.status(500).json({ success: false, message: 'Có lỗi trong quá trình gửi email' });
    } else {
      console.log('Email đã được gửi thành công: ' + info.response);
      return res.status(200).json({ success: true, message: 'Mật khẩu mới đã được gửi đến email của bạn' });
    }
  });
};
