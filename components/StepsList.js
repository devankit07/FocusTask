"use client";

import { useState } from "react";

export default function StepsList({
  steps,
  onAddStep,
  onToggleStep,
  onUpdateStep,
  taskId,
}) {
  const [stepText, setStepText] = useState("");

  const completedSteps = steps.filter((step) => step.completed).length;

  const handleAddStep = () => {
    const trimmedStep = stepText.trim();

    if (!trimmedStep) {
      return;
    }

    onAddStep(trimmedStep);
    setStepText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddStep();
    }
  };

  return (
    <div className="glass-soft rounded-2xl p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Steps</h3>
        <span className="glass-button w-fit rounded-full px-3 py-1 text-xs font-medium text-slate-600">
          {completedSteps}/{steps.length} completed
        </span>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={stepText}
          onChange={(event) => setStepText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a step"
          className="glass-input flex-1 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={handleAddStep}
          className="glass-button rounded-xl px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/40 sm:w-auto"
        >
          Add
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-slate-500">No steps yet. Break the task into smaller actions.</p>
      ) : (
        <ul className="space-y-2">
          {steps.map((step) => (
            <li
              key={step.id}
              className="glass-input flex items-start gap-3 rounded-xl px-3 py-2"
            >
              <input
                id={`${taskId}-${step.id}`}
                type="checkbox"
                checked={step.completed}
                onChange={() => onToggleStep(step.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {step.completed ? (
                <label
                  htmlFor={`${taskId}-${step.id}`}
                  className="min-w-0 break-words text-sm text-slate-400 line-through"
                >
                  {step.text}
                </label>
              ) : (
                <input
                  type="text"
                  value={step.text}
                  onChange={(event) => onUpdateStep(step.id, event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
