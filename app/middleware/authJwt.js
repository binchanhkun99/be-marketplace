const jwt = require("jsonwebtoken");
const config = require("../../app/config/auth.config");
const db = require("../../app/models");
const User = db.user;
const NewUser = db.NewUsers


verifyToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7); // Bỏ qua "Bearer " trong chuỗi
  } else {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  console.log(">>>>>>>>>>>>Check token:", token)

  jwt.verify(token, config.secret, (err, decoded) => {
    console.log("check token", req.body)
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

checkUser = async (req, res, next) =>{
  try {
    // console.log("Boddydydyydd", req.body.data);
    const {email, access_token} = req.body.data[0]
    // const email = req.body.data.email
    // const access_token = req.body.data.access_token
  
    
  jwt.verify(access_token, config.secret, (err, decoded) => {
   
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
  });
    const user = await NewUser.findOne({
      where: {
        email: email
      
      }
    });

    if (user) {
      // Nếu tìm thấy user, gửi phản hồi với thông báo thành công
      // return res.status(200).json({ success: true, message: "User exists" });
      next();
    } else {
      // Nếu không tìm thấy user, gửi phản hồi với thông báo không thành công
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}
checkUserGet = async (req, res, next) =>{
  try {
    console.log("Hiiii");
    const {email, access_token} = req.query
    console.log("Emailllll______________", email);
    const user = await User.findOne({
      where: {
        email: email,
        access_token: access_token
      }
    });
    if (user) {
      // Nếu tìm thấy user, gửi phản hồi với thông báo thành công
      // return res.status(200).json({ success: true, message: "User exists" });
      next();
    } else {
      // Nếu không tìm thấy user, gửi phản hồi với thông báo không thành công
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
const authJwt = {
  verifyToken: verifyToken,
  checkUser: checkUser,
  checkUserGet: checkUserGet
};
module.exports = authJwt;
