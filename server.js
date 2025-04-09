const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const adminproductrouter = require("./routes/productroutes");
const adminorderrouter = require("./routes/orderroutes");
const authrouter = require("./routes/authroutes");
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/admin/products", adminproductrouter);
app.use("/api/admin/orders", adminorderrouter);
app.use("/api/auth", authrouter);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
