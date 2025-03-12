const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (err) {
    return console.log("Could not connect", err);
  }
  console.log("Connected to the database");
};
module.exports = connectdb;

// const mongoose = require("mongoose");
// require("dotenv").config(); // Load .env variables

// const connectdb = async () => {
//   try {
//     if (!process.env.MONGODB) {
//       throw new Error("MONGODB connection string is missing in .env file");
//     }

//     await mongoose.connect(process.env.MONGODB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ Connected to the database");
//   } catch (err) {
//     console.error("❌ Could not connect to MongoDB:", err.message);
//     process.exit(1); // Exit process if connection fails
//   }
// };

// module.exports = connectdb;
