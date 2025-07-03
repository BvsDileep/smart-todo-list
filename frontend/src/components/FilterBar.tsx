"use client";

import { Dispatch, SetStateAction } from "react";

interface FilterBarProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
}

export default function FilterBar({
  filter,
  setFilter,
  sort,
  setSort,
}: FilterBarProps) {
  return (
    <div className="max-w-md mx-auto flex flex-wrap justify-center items-center gap-4 mt-4 bg-white p-3 rounded shadow">
      <div className="flex items-center gap-2">
        <label htmlFor="filter" className="text-sm font-medium text-gray-700">
          Filter:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="deadline">Deadline</option>
          <option value="created">Created</option>
        </select>
      </div>
    </div>
  );
}
