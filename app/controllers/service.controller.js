const db = require("../../app/models");
const config = require("../config/auth.config");
const _ = require("lodash");
const Service = db.Service;

exports.addService_6x9f5umtm = async (req, res) => {
  try {
    console.log("dkskksdsd");
    const { name, price } = req.body;
    if (name == "" || price == "") {
      res.status(500).send({ message: "Empty value" });
    } else {
      Service.create({
        name: name,
        price: price,
      }).then((data) => {
        res.status(200).send({ success: true, data: data });
      });
    }
  } catch (error) {
    console.error("Failed to create service:", error);
  }
};
