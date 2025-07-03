import * as taskService from "../services/taskService.js";
import { RESPONSE_MESSAGES } from "../utils/globalConstants.js";
import { getPrioritySuggestion } from "../utils/aiUtils.js";

//Get Priority using AI intelligence
export const getPriority = async (req, res) => {
  try {
    const { title, description } = req.body;
    const suggestion = await getPrioritySuggestion(title, description);
    res.json({ priority: suggestion });
  } catch (error) {
    console.error("Error getting priority suggestion:", error);
    res.status(500).json({ error: "AI priority suggestion failed" });
  }
};

// Create a new task
// taskService.js

export const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await taskService.createTask({ title, description, deadline });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ message: RESPONSE_MESSAGES.DELETE_TASK_SUCCESS });
  } catch (error) {
    next(error);
  }
};

// Delete a batch of tasks
export const deleteCompletedTasks = async (req, res) => {
  try {
    const deletedTasks = await taskService.deleteCompletedTasks();
    res.status(200).json({
      message: `Deleted ${deletedTasks.count} completed tasks.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: RESPONSE_MESSAGES.ALL_COMPLETE_REQ_FAIL });
  }
};
