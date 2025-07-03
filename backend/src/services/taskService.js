import prisma from "../config/db.js";
import { ORDER_BY } from "../utils/globalConstants.js";
import { getPrioritySuggestion } from "../utils/aiUtils.js";

// Create a new task

export const createTask = async ({ title, description, deadline }) => {
  const priority = await getPrioritySuggestion(title, description, deadline);

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      status: "ongoing",
      priority,
    },
  });

  return newTask;
};

// Get all tasks
export const getTasks = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: ORDER_BY.DESC },
  });
};

// Get a single task by ID
export const getTaskById = async (id) => {
  return await prisma.task.findUnique({
    where: { id },
  });
};

// Update a task
export const updateTask = async (id, data) => {
  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.deadline !== undefined)
    updateData.deadline = new Date(data.deadline);
  if (data.status !== undefined) updateData.status = data.status;

  return await prisma.task.update({
    where: { id },
    data: updateData,
  });
};

// Delete a task
export const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: { id },
  });
};

//Delete batch of tasks
export const deleteCompletedTasks = async () => {
  return await prisma.task.deleteMany({
    where: { status: "completed" },
  });
};
