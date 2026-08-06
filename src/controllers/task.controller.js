const tasksServices = require('../services/task.service');
const AppError = require('../utils/AppError');
const Task = require('../models/task.model')

const createTask = async (req,res)=> {

    const task = await tasksServices.createTask({...req.body, user: req.user._id});

    return res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: task
    })

}

const getAllTasks = async(req,res) => {

    const {tasks,
    totalTasks,
    totalPages,
    limit,
    page} = await tasksServices.getAllTasks({
        ...req.query,
        user: req.user
    });

    return res.status(200).json({
        success: true,
                message: 'Get all tasks.',
        page: page,
        limit: limit,
        totalTasks: totalTasks,
        totalPages: totalPages,
        results: tasks.length,
        data: tasks,
    })

}

const getTaskById = async (req,res)=> {

    const task = await tasksServices.getTaskById({taskId: req.params.id, user: req.user});

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Get task by id successfully.',
        data: task,
    })

}

const updateTask = async(req,res)=> {

    const task = await tasksServices.updateTask({
        taskId: req.params.id,
        user: req.user,
        data: req.body
    });

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Update task successfully.',
        data: task,
    });

}

const deleteTask = async (req,res)=> {

    const task = await tasksServices.deleteTask({taskId: req.params.id,user: req.user});

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Task deleted successfully.'
    })

}

const restoreTask = async(req,res)=> {

    const task = await tasksServices.restoreTask({taskId: req.params.id, user: req.user});

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Task restored successfully.',
        data: task,
    });

}


const toggleFavorite = async(req,res)=> {

    const task = await tasksServices.toggleFavorite({taskId: req.params.id, user: req.user});

    if(!task) {

        throw new AppError('Task not found', 404);

    }

    return res.status(200).json({
        success: true,
        message: task.isFavorite ? 'Task added to favorites' : 'Task removed from favorites',
        data: task,
    });

}

const getFavoriteTasks = async (req,res)=> {

    const tasks = await tasksServices.getFavoriteTasks({user: req.user});

    if(!tasks) {
        throw new AppError('Tasks Not Found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'fetching all task favorites',
        results: tasks.length,
        data: tasks
    });

}

const toggleArchive = async (req,res)=> {

    const task = await tasksServices.toggleArchive({taskId: req.params.id, user: req.user});

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: task.isArchived ? "Task archived successfully" : "Task restored from archive",
        data: task
    });

}

const getArchivedTasks = async (req,res)=> {

    const tasks = await tasksServices.getArchivedTasks({user: req.user});

    return res.status(200).json({
        success: true,
        message: 'fetching all task favorites',
        results: tasks.length,
        data: tasks,
    });

}

const statistics = async(req,res)=> {

    const stats = await tasksServices.statistics({user: req.user});

    return res.status(200).json({
        success: true,
        data: stats
    })

}


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
    statistics
}