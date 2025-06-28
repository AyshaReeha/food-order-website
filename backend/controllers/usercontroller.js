import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";


const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: {
      id: user._id,
      Name: user.Name,
      Email: user.Email,
      MobileNo: user.MobileNo,
      role: user.role,
    },
  });
};

export const registerUser = async (req, res) => {
  try {
    const { Name, Email, MobileNo, role, Password } = req.body;

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (role === "admin" && req.body.Password !== process.env.ADMIN_SECRET) {
  return res.status(403).json({ message: "Invalid admin signup password" });
    }
    if (role === "owner" && req.body.Password !== process.env.OWNER_SECRET) {
  return res.status(403).json({ message: "Invalid owner signup password" });
    }


    const user = await User.create({ Name, Email, MobileNo, role, Password });
    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-Password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
