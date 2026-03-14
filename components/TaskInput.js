"use client";

import { useState } from "react";

const emptyForm = {
  title: "",
  note: "",
  startDate: "",
  deadlineDate: "",
};

export default function TaskInput({ onAddTask }) {
  const [form, setForm] = useState(emptyForm);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAddTask({
      title: trimmedTitle,
      note: form.note.trim(),
      startDate: form.startDate,
      deadlineDate: form.deadlineDate,
    });

    setForm(emptyForm);
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Task title
          </label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="What do you want to get done?"
            className="glass-input w-full rounded-2xl px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="task-note"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Note
          </label>
          <textarea
            id="task-note"
            rows="3"
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Optional note or reminder"
            className="glass-input w-full resize-none rounded-2xl px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="task-start-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Start date
          </label>
          <input
            id="task-start-date"
            type="date"
            value={form.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            className="glass-input w-full rounded-2xl px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="task-deadline-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Deadline
          </label>
          <input
            id="task-deadline-date"
            type="date"
            value={form.deadlineDate}
            onChange={(event) => updateField("deadlineDate", event.target.value)}
            className="glass-input w-full rounded-2xl px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="glass-button w-full rounded-2xl px-4 py-3 font-semibold text-slate-900 transition hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          Add Task
        </button>
      </div>
    </section>
  );
}
