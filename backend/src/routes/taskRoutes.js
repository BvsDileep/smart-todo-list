import express from "express";
import * as taskController from "../controllers/taskController.js";
import { ROUTES } from "../utils/globalConstants.js";

const router = express.Router();

// Routes for tasks
router.post(ROUTES.PRIORITY_SUGGESTION, taskController.getPriority);
router.delete(ROUTES.COMPLETED, taskController.deleteCompletedTasks);
router.post(ROUTES.ROOT, taskController.createTask);
router.get(ROUTES.ROOT, taskController.getTasks);
router.get(ROUTES.ROOT_PATH_PARAM, taskController.getTaskById);
router.put(ROUTES.ROOT_PATH_PARAM, taskController.updateTask);
router.delete(ROUTES.ROOT_PATH_PARAM, taskController.deleteTask);

export default router;
