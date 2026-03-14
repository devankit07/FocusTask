"use client";

import StepsList from "./StepsList";

function formatDate(value) {
  if (!value) {
    return "No date selected";
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  return parsed.toLocaleDateString([], {
    dateStyle: "medium",
  });
}

export default function TaskCard({
  task,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onAddStep,
  onToggleStep,
}) {
  const completedSteps = task.steps.filter((step) => step.completed).length;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <input
            id={`task-${task.id}`}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={`block break-words text-lg font-semibold ${
                task.completed ? "text-slate-400 line-through" : "text-slate-900"
              }`}
            >
              {task.title}
            </label>
            <p className="mt-1 text-sm text-slate-500">
              {completedSteps}/{task.steps.length} steps complete
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
        >
          Delete
        </button>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Start date
          </p>
          <p className="mb-3 text-sm text-slate-700">{formatDate(task.startDate)}</p>
          <input
            type="date"
            value={task.startDate}
            onChange={(event) => onUpdateTask(task.id, { startDate: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Deadline
          </p>
          <p className="mb-3 text-sm text-slate-700">{formatDate(task.deadlineDate)}</p>
          <input
            type="date"
            value={task.deadlineDate}
            onChange={(event) => onUpdateTask(task.id, { deadlineDate: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Note
          </label>
          <textarea
            rows="5"
            value={task.note}
            onChange={(event) => onUpdateTask(task.id, { note: event.target.value })}
            placeholder="Add details for this task"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <StepsList
        taskId={task.id}
        steps={task.steps}
        onAddStep={(stepText) => onAddStep(task.id, stepText)}
        onToggleStep={(stepId) => onToggleStep(task.id, stepId)}
      />
    </article>
  );
}
