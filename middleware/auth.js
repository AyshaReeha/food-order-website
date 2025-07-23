 
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

// const protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//      if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }
//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decoded.id).select("-Password");
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

// export default protect;



const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-Password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
