const Task = require("../models/task.model");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const createTask = async (data) => {
  const task = await Task.create(data);

  return task;
};

const getAllTasks = async (query) => {
  const {
    user,
    search,
    status,
    priority,
    category,
    sort,
    page,
    limit,
    fields,
  } = query;

  const filter = {
    user: user.id,
    isDeleted: false,
  };

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (category) {
    filter.category = category;
  }

  const sorted = sort || "-createdAt";

  const pageSize = Number(page) || 1;
  const limitSize = Number(limit) || 10;

  const skip = (pageSize - 1) * limitSize;

  let tasksQuery = Task.find(filter).sort(sorted).skip(skip).limit(limitSize);

  if (fields) {
    tasksQuery = tasksQuery.select(fields.split(",").join(" "));
  }

  const tasks = await tasksQuery;

  const totalTasks = await Task.countDocuments(filter);

  const totalPages = Math.ceil(totalTasks / limitSize);

  return {
    tasks,
    totalTasks,
    totalPages,
    limit: limitSize,
    page: pageSize,
  };
};

const getTaskById = async ({ taskId, user }) => {
  const task = await Task.findOne({
    _id: taskId,
    user: user.id,
    isDeleted: false,
  }).populate("user", "name email");

  if (!task) {
    return null;
  }

  return task;
};

const updateTask = async ({ user, taskId, data }) => {
  if (data.status === "completed") {
    data.completedAt = new Date();
  } else if (data.status) {
    data.completedAt = null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: user.id },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    return null;
  }

  return task;
};

const deleteTask = async ({ user, taskId }) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: user.id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    return null;
  }

  return task;
};

const restoreTask = async ({ user, taskId }) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: user.id, isDeleted: true },
    {
      isDeleted: false,
      deletedAt: null,
    },
    {
      new: true,
      includeDeleted: true,
    },
  );

  if (!task) {
    return null;
  }

  return task;
};

const toggleFavorite = async ({user, taskId})=> {

  const task = await Task.findOne({
    _id: taskId,
    user: user.id,
    isDeleted: false,
  });

  if(!task) {
    return null;
  }

  task.isFavorite = !task.isFavorite;

  await task.save();

  return task;

}

const getFavoriteTasks = async({user}) => {

  const tasks = await Task.find({
    user: user._id,
    isFavorite: true,
    isDeleted: false
  });

  return tasks;

}

const toggleArchive = async({user, taskId}) => {

  const task = await Task.findOne({
    _id: taskId,
    user: user.id,
    isDeleted: false
  });

  if(!task) {
    return null;
  }

  task.isArchived = !task.isArchived;

  await task.save();

  return task;

}


const getArchivedTasks = async({user})=> {

  const tasks = await Task.find({
    user: user.id,
    isArchived: true,
    isDeleted: false
  });

  return tasks;

}

const statistics = async ({ user }) => {
  const stats = await Task.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user.id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalTasks: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
        pending: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "pending"],
              },
              1,
              0,
            ],
          },
        },
        inProgress: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "in-progress"],
              },
              1,
              0,
            ],
          },
        },
        highPriority: {
          $sum: {
            $cond: [
              {
                $eq: ["$priority", "high"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const defaultStats = {
    totalTasks: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
  };

  return stats[0] || defaultStats;
};




module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  restoreTask,
  toggleFavorite,
  getFavoriteTasks,
  toggleArchive,
  getArchivedTasks,
  statistics,
};
