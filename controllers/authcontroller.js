const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Login User
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let checkUser = isNaN(identifier)
      ? await User.findOne({ email: { $eq: identifier } })
      : await User.findOne({ phone: { $eq: identifier } });

    if (!checkUser) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({ success: false, message: "Incorrect password!" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: checkUser._id, role: checkUser.role },
      JWT_SECRET, //add this in environment variable
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        name: checkUser.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh-token" });
  res.json({ success: true, message: "Logged out successfully!" });
};

module.exports = {
  loginUser,
  logoutUser,
};
