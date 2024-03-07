const db = require("../../app/models");
const config = require("../config/auth.config");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const Assets = db.assets;

const Op = db.Sequelize.Op;

exports.addAssets = async (req, res) => {
    try {
      const { uid_template, name, type, parents } = req.body;
      Assets.create({
        uid_template: uid_template,
        name: name,
        type: type,
        parents: parents
      }).then((asset) => { // Đổi tên biến res thành asset
        const dataRes = asset.dataValues;
        res.status(200).send({ success: true, data: dataRes });
      }).catch((err) => {
        res.status(500).send({ message: err.message });
      });
    } catch (error) {
      console.log(error);
    }
  };
  
exports.findAssetsByName = async (req, res) => {
    try {
      const { name } = req.body; // Lấy tên từ query parameter
  
      // Tìm kiếm tất cả các bản ghi trong bảng Assets có trường "name" trùng khớp với giá trị được cung cấp
      const assets = await Assets.findAll({
        where: {
          name: name
        }
      });
  
      // Trả về các bản ghi tìm thấy
      res.status(200).send({ success: true, data: assets });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };