"use client";

import { useState } from "react";

export default function StepsList({ steps, onAddStep, onToggleStep, taskId }) {
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Steps</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          {completedSteps}/{steps.length} completed
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={stepText}
          onChange={(event) => setStepText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a step"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={handleAddStep}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
              className="flex items-start gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
            >
              <input
                id={`${taskId}-${step.id}`}
                type="checkbox"
                checked={step.completed}
                onChange={() => onToggleStep(step.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`${taskId}-${step.id}`}
                className={`text-sm ${
                  step.completed ? "text-slate-400 line-through" : "text-slate-700"
                }`}
              >
                {step.text}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
