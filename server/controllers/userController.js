import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!(name && email && password && confirmpassword)) {
    return res.status(400).send("All fields are required");
  }

  if (password !== confirmpassword) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(401).send("User already exists with this email");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    user.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error.stack); // Log the full stack trace
    return res.status(500).send("Server error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Login error:", error.stack); // Log the full stack trace
    return res.status(500).json({ message: "Server error" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  console.log("Got email:", email);

  if (!email) {
    return res.status(401).send("Email is not valid");
  }

  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(401).send("User does not exist");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "doris.hyatt@ethereal.email",
        pass: "HkZbWMMtQeG6r3TW3F",
      },
    });

    const mailOptions = {
      from: "itachi966uchiha@gmail.com", // Use environment variable
      to: user.email,
      subject: "Reset your password",
      text: `http://localhost:5173/resetpass/${user._id}/${token}`, // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent: " + info.response);
      return res.send({ status: "success", messageId: info.messageId });
    });
  } catch (error) {
    console.error(`Server error: ${error}`);
    return res.status(500).send("Server error");
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.send({ status: "success", message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Server error");
  }
};
