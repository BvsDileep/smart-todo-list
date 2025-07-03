import React from "react";

interface TaskProps {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
}

const TaskCard: React.FC<TaskProps> = ({
  title,
  description,
  deadline,
  status,
}) => {
  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Deadline: {new Date(deadline).toLocaleDateString()}
      </p>
      <p className="text-xs">Status: {status}</p>
    </div>
  );
};

export default TaskCard;
