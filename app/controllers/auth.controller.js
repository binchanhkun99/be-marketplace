const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const newUser = db.NewUsers
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signin = async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if(user){
    const { id, updatedAt, email_verified, ...userData} = user.dataValues
    // delete userData.id;
    // delete userData.updatedAt;
    res.status(200).send({ success: true, data: userData });
  }
  else{
    const expiresIn = 3 * 365 * 24 * 60 * 60;
    var token = jwt.sign({ email: req.body.email }, config.secret, {
      expiresIn: expiresIn,
    });
    const emailVerifiedString = req.body.email_verified ? 'true' : 'false';
    User.create({
      email: req.body.email,
      sub: req.body.sub,
      email_verified: emailVerifiedString,
      access_token: token,
      picture: req.body.picture,
      type: req.body.type
    })
      .then((newUser) => {
        const { id, updatedAt, email_verified, ...userData} = newUser.dataValues; // Lấy dữ liệu từ thuộc tính dataValues
        res.status(200).send({ success: true, data: userData });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

// exports.signinUser = async (req, res) => {
//   const user = await User.findOne({
//     where: { email: req.body.email },
//   });
//   if(user){
//     const { access_token, ...userData} = user.dataValues
//     // delete userData.id;
//     // delete userData.updatedAt;
//     res.status(200).send({ success: true, data: userData });
//   }
//   else{
//     const expiresIn = 3 * 365 * 24 * 60 * 60;
//     var token = jwt.sign({ email: req.body.email }, config.secret, {
//       expiresIn: expiresIn,
//     });
//     // const emailVerifiedString = req.body.email_verified ? 'true' : 'false';
//     User.create({
//       email: req.body.email,
//       password: req.body.password,
//       app_name: req.body.app_name
//     })
//       .then((newUser) => {
//         const {access_token, ...userData} = newUser.dataValues; // Lấy dữ liệu từ thuộc tính dataValues
//         res.status(200).send({ success: true, data: userData });
//       })
//       .catch((err) => {
//         res.status(500).send({ message: err.message });
//       });
//   }
// };

exports.signinUser = (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).send({ message: "Email or username is required." });
  }

  let whereCondition = {};

  if (email) {
    whereCondition.email = email;
  }

  if(!password){
    return res.status(401).send({
      success: false,
      message: "Invalid Password!",
     
    });
  }

  User.findOne({
    where: whereCondition,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
  
      var passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 8640000,
      });

      res.status(200).send({
        success: true,
        id: user.id,
        email: user.email,
        app_name: user.app_name,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.registerUser = async (req, res) => {
  const { email, password, app_name } = req.body;

  // Kiểm tra xem email và mật khẩu có được cung cấp không
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  try {
    // Kiểm tra xem email đã được sử dụng trước đó chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "Email is already in use." });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới trong cơ sở dữ liệu
    const newUser = await User.create({
      email,
     
      password: hashedPassword,
      maGioiThieu: maGioiThieu || null,
      app_name: app_name
    });

    // Trả về thông tin của người dùng mới đã đăng ký
    res.status(201).send({
      success: true,
      message: "User registered successfully.",
      data: {
        id: newUser.id,
        email: newUser.email,
       
      },
    });
  } catch (error) {
    // Xử lý bất kỳ lỗi nào xảy ra trong quá trình đăng ký
    res.status(500).send({ message: error.message });
  }
};
exports.changePassword = async (req, res) => {
  try {
    // Lấy id user thông qua token
    const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header Authorization
    // Giải mã token và lấy thông tin từ payload
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    const { newPassword, oldPassword } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(userId);

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid old password." });
    }

    // Hash và cập nhật mật khẩu mới
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    res.send({ success: true, message: "Password updated successfully." });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
