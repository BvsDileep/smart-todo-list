"use client";

import { useEffect, useState } from "react";
import CreateTaskForm from "@/components/CreateTaskForm";
import FilterBar from "@/components/FilterBar";
import Modal from "@/components/Modal";

// Centralized Task type
interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("created");

  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState<Task | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Fetch tasks on load
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`
      );
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete a task
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle status
  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "ongoing" ? "completed" : "ongoing";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Add new task
  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Update task after editing
  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsEditModalOpen(false);
    setSelectedTaskToEdit(null);
  };

  // Clear completed tasks
  const handleClearCompleted = async () => {
    if (!confirm("Are you sure you want to clear all completed tasks?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/completed`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Failed to clear completed tasks");
      }
    } catch (error) {
      console.error("Error clearing completed tasks", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-center text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        📝 Smart Todo List
      </h1>

      {/* Create new task */}
      <CreateTaskForm onTaskCreated={handleTaskCreated} />

      {/* Filter and sort */}
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      {/* Clear completed button */}
      <button
        onClick={handleClearCompleted}
        className="fixed bottom-4 right-4 bg-red-600 text-white rounded-full px-4 py-2 shadow-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        🧹 Clear Completed
      </button>

      {/* Progress bar */}
      <div className="max-w-md mx-auto mt-4">
        <p className="text-sm text-center mb-1">
          Progress: {progress}% completed
        </p>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <p className="text-center mt-6">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center mt-6">
          No tasks available. Add your first task!
        </p>
      ) : (
        <ul className="max-w-md mx-auto mt-6 space-y-3">
          {tasks
            .filter((task) =>
              filter === "all" ? true : task.status === filter
            )
            .sort((a, b) =>
              sort === "deadline"
                ? new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime()
                : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
            )
            .map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition flex justify-between items-start"
              >
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Priority:{" "}
                    <span
                      className={
                        task.priority === "high"
                          ? "text-red-600 font-semibold"
                          : task.priority === "medium"
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {task.priority}
                    </span>
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    } mt-1 inline-block`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(task.id, task.status)}
                    className={`text-xs border rounded px-2 py-1 ${
                      task.status === "completed"
                        ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                        : "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600"
                    }`}
                  >
                    {task.status === "completed"
                      ? "Mark Ongoing"
                      : "Mark Completed"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTaskToEdit(task);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-xs border border-blue-300 rounded px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700 text-xs border border-red-300 rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </ul>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTaskToEdit && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <CreateTaskForm
            existingTask={selectedTaskToEdit}
            onTaskUpdated={handleTaskUpdated}
          />
        </Modal>
      )}
    </div>
  );
}
