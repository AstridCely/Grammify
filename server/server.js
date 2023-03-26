const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", require("./routes/appRoute"));

app.listen(5000, () => console.log(`Server is running on port 5000`));
