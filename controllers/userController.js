//User Controller

const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../jwt/generateToken");

//hash function

const hashFunction = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hashSync(password, salt);
};

// Register a user
const register = async (req, res, next) => {
  let { username, password, gmail } = req.body;

  //to trim to remove spaces
  username = username?.trim();
  gmail = gmail?.trim().toLowerCase();

  // Validate input
  if (!username || !password || !gmail) {
    return res.status(400).json({ message: "Please provide all details" });
  }

  try {
    const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!gmailRegex.test(gmail)) {
      return res.status(400).json({ message: "Invalid gmail format" });
    }
    const existingUser = await userModel.findOne({ gmail });
    if (existingUser) {
      return res.status(409).json("User already existed");
    }
    const hashedPassword = await hashFunction(password);

    // Create a new user instance
    const newUser = new userModel({ ...req.body, password: hashedPassword });

    // Save the user in the database
    await newUser.save();
    res.status(201).json({ newUser, message: "User registeration suceessful" });
  } catch (error) {
    next(error);
  }
};

//Login a user
const login = async (req, res, next) => {
  //  Extract Email & Password from the Request Body
  const { gmail, password } = req.body;

  try {
    // Find User in the Database
    const user = await userModel.findOne({ gmail });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Account not found, please register with us" });
    }
    //  Compare Hashed Passwords
    const comparison = await bcrypt.compare(password, user.password);
    if (!comparison) {
      return res.status(400).json({ message: "Password or gmail incorrect" });
    }
    //  Generate a JWT Token
    const token = generateToken(user._id);
    console.log("Generated Token:", token);
    // Store the Token in Cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    // Remove Password from User Object
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: "User logged in successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};

// These are the changes made to the userController.js file:
// const userModel = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const generateToken = require("../jwt/generateToken");

// // Hash function
// const hashFunction = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt); // Removed unnecessary await
// };

// // Register a user
// const register = async (req, res, next) => {
//   let { username, password, email } = req.body;

//   // Trim input fields
//   username = username?.trim();
//   email = email?.trim().toLowerCase();

//   // Validate input
//   if (!username || !password || !email) {
//     return res.status(400).json({ message: "Please provide all details" });
//   }

//   try {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     // Check for existing user
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     const hashedPassword = await hashFunction(password);

//     // Create and save new user
//     const newUser = new userModel({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ user: newUser, message: "User registration successful" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Login a user
// const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Account not found, please register" });
//     }

//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = generateToken(user._id);

//     // Store token in cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Use false in dev
//       sameSite: "strict",
//       maxAge: 3600000,
//     });

//     // Exclude password from user object
//     const { password: _, ...userWithoutPassword } = user.toObject();

//     res.status(200).json({
//       message: "User logged in successfully",
//       user: userWithoutPassword,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { register, login };
