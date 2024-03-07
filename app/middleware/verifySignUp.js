const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;


checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(userEmail => {
    if (userEmail) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    // Check username
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(userUsername => {
      if (userUsername) {
        res.status(400).send({
          message: "Failed! Username is already in use!"
        });
        return;
      }

      next();
    });
  });
};






const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
