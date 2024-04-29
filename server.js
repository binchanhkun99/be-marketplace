const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// database
const db = require("./app/models");
try {
  db.sequelize.sync();
} catch (error) {
  console.log(error);
}

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to onewise èn tai tờ mần." });
});

// routes app
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

require("./app/routes/assets.router")(app)
require("./app/routes/notify.routes")(app)
require("./app/routes/payment.router")(app)
require("./app/routes/service.router")(app)
require("./app/routes/extensions.routes")(app)
// set port, listen for requests
const PORT = 2053;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
