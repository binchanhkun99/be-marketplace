const db = require("../models")
const Extension = db.Extensions
const Op = db.Sequelize.Op


exports.listing = async (req, res) =>{
    try {
        const listing = await Extension.findAll()
        res.status(200).send({
            message: "Listing extensions success",
            success: true,
            data: listing
        })
    } catch (error) {
        console.log(error);
    }
}
