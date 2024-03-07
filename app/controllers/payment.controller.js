require("dotenv").config();
const db = require("../../app/models");
const Service = db.Service;
const User = db.user;
const ServiceForUser = db.ServiceForUser;
const moment = require("moment");
const sequelize = db.sequelize;

// const base = "https://api-m.paypal.com"; //Product
const base = "https://api-m.sandbox.paypal.com"; //Sandbox
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// Generate AccessToken Auth Paypal
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};
const createOrder = async (data) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    data[0]
  );
  const getService = await Service.findOne({
    where: {
      name: data[0].id,
    },
  });

  const Price = getService.dataValues.price;
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: Price,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID, data) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

exports.Order = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { data } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(data);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

exports.Capture = async (req, res) => {
  try {
    const { orderID } = req.params;
    const data = req.body.data[0];
    const arrTime = { v1: "30", v3: "90", v6: "180", v12: "365" };
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID, data);
    const packageDuration = arrTime[data.id];
    const expiryDate = moment().add(packageDuration, "days").toDate();
    //  const idService = getAllService.dataValues.id
    const getAllService = await Service.findOne({
      where: {
        name: data.id,
      },
    });

    const idService = getAllService.dataValues.id;
    //
    if (getAllService) {
      if (jsonResponse.status === "COMPLETED") {
        const checkUser = await User.findOne({
          where: {
            email: data.email,
          },
        });

        const idUser = checkUser.dataValues.id;
        const checkExits = await ServiceForUser.findOne({
          where: {
            user_id: idUser,
          },
        });
        if (checkExits) {
          const previousServiceForUser = await ServiceForUser.findOne({
            where: {
              user_id: idUser,
            },
          });
          const PSFU = previousServiceForUser.dataValues.expiry_date;

          const previousExpiryDate = moment(PSFU);
          const newExpiryDate = previousExpiryDate
            .add(packageDuration, "days")
            .toDate();
          await ServiceForUser.update(
            {
              expiry_date: newExpiryDate,
              name_service: data.id,
            },
            {
              where: {
                user_id: idUser,
              },
            }
          );
          return res.status(200).json({ success: true, message:"Payment Success" });
        } else {
          const checkUser = await User.findOne({
            where: {
              email: data.email,
            },
          });

          const nameService = getAllService.dataValues.name;
          const idUser = checkUser.dataValues.id;

          await ServiceForUser.create({
            user_id: idUser,
            service_id: idService,
            name_service: nameService,
            expiry_date: expiryDate,
            status: 1,
          });
          await User.update(
            {
              status: "2",
            },
            {
              where: {
                id: idUser,
              },
            }
          );
        }
      }
      return res.status(200).json({ success: true, message:"Payment Success" });
    } else {
      return res.status(404).json({ error: "Service not found!" });
    }

  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

exports.checkService = async (req, res) => {
  const { access_token, email } = req.query;

  try {
    let results = await sequelize.query(
      `
      SELECT users.*, service_for_users.*, TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS days_remaining
      FROM users
      LEFT JOIN service_for_users ON users.id = service_for_users.user_id
      WHERE users.email = :email`,
      {
        replacements: { email: email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Kiểm tra nếu user_id là null
    if (!results[0].user_id) {
      return res
        .status(404)
        .json({ success: false, error: "User has no associated services." });
    }

    // Kiểm tra nếu gói dịch vụ đã hết hạn
    if (moment().isAfter(results[0].expiry_date)) {
      console.log("Hết hạn gòi..............");

      // Cập nhật lại expiry_date, name_service, và service_id
      await ServiceForUser.update(
        {
          expiry_date: moment().format(),
          name_service: "v0",
          service_id: 5,
        },
        {
          where: { user_id: results[0].user_id },
        }
      );

      // Lấy lại dữ liệu mới sau khi cập nhật
      results = await sequelize.query(
        `
        SELECT users.*, service_for_users.*, TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS days_remaining
        FROM users
        LEFT JOIN service_for_users ON users.id = service_for_users.user_id
        WHERE users.email = :email`,
        {
          replacements: { email: email },
          type: sequelize.QueryTypes.SELECT,
        }
      );
    } else {
      console.log("Chưa hết hạn>>>>>>>>>>>>>>>>>>", results[0].expiry_date);
    }

    // Chọn lọc các trường mà bạn muốn giữ lại
    const filteredResults = results.map((result) => ({
      id: result.id,
      picture: result.picture,
      email: result.email,
      status: result.status,
      type: result.type,
      createdAt: result.createdAt,
      service_id: result.service_id,
      name_service: result.name_service,
      days_remaining: result.days_remaining,
      expiry_date: moment(result.expiry_date).format(
        "MMMM DD, YYYY hh:mm:ss A"
      ),
    }));

    // Trả về kết quả cho client
    res.status(200).json({ success: true, filteredResults });
  } catch (error) {
    console.error("Error:", error); // Xử lý lỗi nếu có
    res.status(500).json({ error: "Failed to check service." });
  }
};
