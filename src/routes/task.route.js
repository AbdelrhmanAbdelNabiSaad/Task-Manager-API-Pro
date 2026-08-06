const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const protect = require('../middlewares/protect.middleware');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, restoreTask, statistics, toggleFavorite, getFavoriteTasks, toggleArchive, getArchivedTasks } = require('../controllers/task.controller');


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Node.js
 *               description:
 *                 type: string
 *                 example: Study Express and MongoDB
 *               priority:
 *                 type: string
 *                 example: high
 *               status:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, asyncHandler(createTask));
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks list
 */
router.get('/', protect, asyncHandler(getAllTasks))
/**
 * @swagger
 * /tasks/statistics:
 *   get:
 *     summary: Get task statistics
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics returned successfully
 */
router.get('/statistics', protect, asyncHandler(statistics))

/**
 * @swagger
 * /tasks/favorites:
 *   get:
 *     summary: Get all favorite tasks for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/favorites', protect, asyncHandler(getFavoriteTasks));
/**
 * @swagger
 * /tasks/archive:
 *   get:
 *     summary: Get all archived tasks for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archived tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/archive', protect, asyncHandler(getArchivedTasks));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, asyncHandler(getTaskById))

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.patch('/:id', protect, asyncHandler(updateTask));
/**
 * @swagger
 * /tasks/{id}/restore:
 *   patch:
 *     summary: Restore a soft deleted task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task restored successfully
 *       404:
 *         description: Task not found or task is not deleted
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/restore', protect, asyncHandler(restoreTask));
/**
 * @swagger
 * /tasks/{id}/favorite:
 *   patch:
 *     summary: Add or remove a task from favorites
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           example: 6893d7e6f5d2b2c5b1d2a111
 *     responses:
 *       200:
 *         description: Favorite status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task added to favorites
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.patch('/:id/favorite', protect, asyncHandler(toggleFavorite));
/**
 * @swagger
 * /tasks/{id}/archive:
 *   patch:
 *     summary: Archive or unarchive a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           example: 6893d7e6f5d2b2c5b1d2a111
 *     responses:
 *       200:
 *         description: Archive status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task archived successfully
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.patch('/:id/archive', protect, asyncHandler(toggleArchive));
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', protect, asyncHandler(deleteTask));




module.exports = router;