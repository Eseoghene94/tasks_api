const express = require("express");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/dbController");
const taskRouter = require("./routes/taskRouter");
const app = express();

require("dotenv").config();

connectdb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api", userRouter);
app.use("/api", taskRouter);

const port = process.env.PORT;

app.listen(port, () => console.log("User Authetication"));

// const express = require("express");
// const userRouter = require("./routes/userRouter");
// const taskRouter = require("./routes/taskRouter");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const connectdb = require("./config/dbController");

// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000; // ✅ Use default port if undefined

// // Connect to database
// connectdb();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(cookieParser());

// // Routes
// app.use("/api/users", userRouter); // ✅ Better route separation
// app.use("/api/tasks", taskRouter);

// // Start server
// app.listen(port, () =>
//   console.log(`✅ User Authentication server running on port ${port}`)
// );
