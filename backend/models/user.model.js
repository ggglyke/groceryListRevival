const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true, // Cette option ajoute les horodatages createdAt et updatedAt
  }
);

userSchema.pre("save", async function (next) {
  if(!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch(e) {next(e);}
});

userSchema.statics.login = async function ( email, password ) {
  if (!password) {
    throw Error("Password is required");
  }

  if (!email) {
    throw Error("Email is required");
  }

  const user = await this.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw Error("Incorrect email");
  }

  const auth = await bcrypt.compare(password, user.password);

  if (!auth) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
