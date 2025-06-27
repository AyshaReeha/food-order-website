import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  MobileNo: { type: Number, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "owner"],
    default: "user"
  },
  Password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.Password);
};

const User = mongoose.model("User", userSchema);
export default User;
