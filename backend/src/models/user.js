import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, unique: true, required: true },
  phoneNumber: {
    type: String,
    required: false,
    validate: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  },
  profileImage: { type: String },
});

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
