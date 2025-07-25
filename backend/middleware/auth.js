 
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-Password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
