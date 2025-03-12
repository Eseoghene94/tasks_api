// Task Controller

const taskModel = require("../models/taskModel");

// Create a task
const create_a_task = async (req, res, next) => {
  const { title, description, category, deadline, completed } = req.body;
  const userId = req.user._id; //Ensuring task is linked to the logged-in user
  try {
    const newTask = new taskModel({ ...req.body, user: userId });
    await newTask.save();
    res.status(201).json({ newTask, message: "Task created successfully" });
  } catch (error) {
    next(error);
  }
};

// Get a task
const get_a_task = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Find the task by ID
    const getTask = await taskModel.findOne({ _id: id, user: userId }); //Ensuring the user can only access their own task
    if (!getTask) {
      return res
        .status(404)
        .json({ message: "Task not found with the provided ID" });
    }

    res.status(200).json({ getTask, message: "Task found successfully" });
  } catch (error) {
    next(error);
  }
};

const get_all_tasks = async (req, res, next) => {
  const userId = req.user._id;
  const { category } = req.query;

  try {
    // Build the query filter dynamically
    const filter = { user: userId };
    if (category) {
      filter.category = category; // Add category filter only if provided
    }

    const tasks = await taskModel.find(filter);

    if (tasks.length === 0) {
      return res.status(200).json({
        tasks,
        message: category
          ? "No tasks found for this category."
          : "No available tasks.",
      });
    }

    res.status(200).json({ tasks, message: "Tasks retrieved successfully." });
  } catch (error) {
    next(error);
  }
};

const update_a_task = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const userId = req.user._id;

  try {
    const getTask = await taskModel.findById(id);
    // Find the task by ID
    if (!getTask) {
      return res
        .status(404)
        .json({ message: "Task not found with the provided ID" });
    }

    // Ensure only the owner can update the task
    if (getTask.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Access denied: You can only update your own tasks.",
      });
    }
    // Update the task with the new details
    const updateTask = await taskModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Task updated successfully.", task: updateTask });
  } catch (error) {
    next(error);
  }
};

const delete_a_task = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const getTask = await taskModel.findById(id);
    if (!getTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (getTask.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Access denied: You can only delete your own tasks.",
      });
    }
    const deleteTask = await taskModel.findByIdAndDelete(id);

    if (!deleteTask) {
      return res
        .status(404)
        .json({ message: "Task not found with the provided ID." });
    }
    res
      .status(200)
      .json({ getTask: deleteTask, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create_a_task,
  get_a_task,
  get_all_tasks,
  update_a_task,
  delete_a_task,
};

// THESE ARE THE CHANGES MADE IN THE TASK CONTROLLER FILE
// const taskModel = require("../models/taskModel");

// // Create a task
// const create_a_task = async (req, res, next) => {
//   const userId = req.user._id;
//   try {
//     const newTask = await taskModel.create({ ...req.body, user: userId });
//     res.status(201).json({ newTask, message: "Task created successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get a single task
// const get_a_task = async (req, res, next) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   try {
//     const getTask = await taskModel.findById(id);
//     if (!getTask || getTask.user.toString() !== userId.toString()) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     res.status(200).json({ getTask, message: "Task found successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all tasks with optional category filter
// const get_all_tasks = async (req, res, next) => {
//   const userId = req.user._id;
//   const { category } = req.query;

//   try {
//     const filter = { user: userId, ...(category && { category }) };
//     const tasks = await taskModel.find(filter);

//     res.status(200).json({
//       tasks,
//       message: tasks.length ? "Tasks retrieved successfully." : "No tasks found.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update a task
// const update_a_task = async (req, res, next) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   try {
//     const updatedTask = await taskModel.findOneAndUpdate(
//       { _id: id, user: userId },
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found or unauthorized" });
//     }

//     res.status(200).json({ task: updatedTask, message: "Task updated successfully." });
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete a task
// const delete_a_task = async (req, res, next) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   try {
//     const deletedTask = await taskModel.findOneAndDelete({ _id: id, user: userId });

//     if (!deletedTask) {
//       return res.status(404).json({ message: "Task not found or unauthorized" });
//     }

//     res.status(200).json({ deletedTask, message: "Task deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   create_a_task,
//   get_a_task,
//   get_all_tasks,
//   update_a_task,
//   delete_a_task,
// };
