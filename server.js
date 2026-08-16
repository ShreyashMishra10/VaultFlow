const app = require("./src/app.js");
require("dotenv").config();
const connectdb = require("./src/config/db.js");

connectdb();

app.listen(3000, () => {
  console.log("Server is successfully running on port 3000");
})