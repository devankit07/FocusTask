"use client";

import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskInput from "../components/TaskInput";

const storageKey = "focus-task-items";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTasks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((task) => ({
    id: task.id || createId(),
    title: task.title || "",
    note: task.note || "",
    startDate: task.startDate || "",
    deadlineDate: task.deadlineDate || task.dateTime?.slice(0, 10) || "",
    completed: Boolean(task.completed),
    steps: Array.isArray(task.steps)
      ? task.steps.map((step) => ({
          id: step.id || createId(),
          text: step.text || "",
          completed: Boolean(step.completed),
        }))
      : [],
  }));
}

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(storageKey);

      if (savedTasks) {
        setTasks(normalizeTasks(JSON.parse(savedTasks)));
      }
    } catch (error) {
      console.error("Unable to load saved tasks", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [hasLoaded, tasks]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const addTask = ({ title, note, startDate, deadlineDate }) => {
    setTasks((currentTasks) => [
      {
        id: createId(),
        title,
        note,
        startDate,
        deadlineDate,
        completed: false,
        steps: [],
      },
      ...currentTasks,
    ]);
  };

  const updateTask = (taskId, updates) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    );
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const addStep = (taskId, stepText) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: [
                ...task.steps,
                {
                  id: createId(),
                  text: stepText,
                  completed: false,
                },
              ],
            }
          : task
      )
    );
  };

  const toggleStep = (taskId, stepId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: task.steps.map((step) =>
                step.id === stepId
                  ? {
                      ...step,
                      completed: !step.completed,
                    }
                  : step
              ),
            }
          : task
      )
    );
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-300/60 sm:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
            Personal productivity
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">FocusTask</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Capture tasks, set a start date and deadline, and track small steps in one clean workspace.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Total tasks</p>
              <p className="mt-1 text-2xl font-semibold">{tasks.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Completed</p>
              <p className="mt-1 text-2xl font-semibold">{completedTasks}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Remaining</p>
              <p className="mt-1 text-2xl font-semibold">{tasks.length - completedTasks}</p>
            </div>
          </div>
        </section>

        <TaskInput onAddTask={addTask} />

        <section className="space-y-4">
          {hasLoaded && tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">No tasks yet</h2>
              <p className="mt-2 text-sm text-slate-500">
                Add your first task to start planning the day.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
                onAddStep={addStep}
                onToggleStep={toggleStep}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
