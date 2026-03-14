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
  const [activeSection, setActiveSection] = useState("home");

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
  const recentTasks = useMemo(() => tasks.slice(0, 3), [tasks]);

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

  const updateStep = (taskId, stepId, text) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: task.steps.map((step) =>
                step.id === stepId
                  ? {
                      ...step,
                      text,
                    }
                  : step
              ),
            }
          : task
      )
    );
  };

  return (
    <main className="px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[2rem] p-3 sm:p-4 lg:sticky lg:top-8 lg:h-fit lg:p-5">
          <nav className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => setActiveSection("home")}
              className={`w-full rounded-2xl px-3 py-3 text-left transition sm:px-4 sm:py-4 ${
                activeSection === "home"
                  ? "glass-button text-slate-900"
                  : "glass-soft text-slate-700 hover:bg-white/40"
              }`}
            >
              <p className="text-base font-semibold">Home</p>
              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                Overview and quick summary
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("tasks")}
              className={`w-full rounded-2xl px-3 py-3 text-left transition sm:px-4 sm:py-4 ${
                activeSection === "tasks"
                  ? "glass-button text-slate-900"
                  : "glass-soft text-slate-700 hover:bg-white/40"
              }`}
            >
              <p className="text-base font-semibold">Tasks</p>
              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                Manage tasks and steps
              </p>
            </button>
          </nav>
        </aside>

        <section className="space-y-6">
          {activeSection === "home" ? (
            <>
              <section className="glass-panel rounded-[2rem] px-6 py-8 text-slate-900 sm:px-8">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-600">
                  Personal productivity
                </p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Home</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Capture tasks, set dates, and keep your work organized from one calm dashboard.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="glass-soft rounded-2xl px-4 py-3">
                    <p className="text-sm text-slate-600">Total tasks</p>
                    <p className="mt-1 text-2xl font-semibold">{tasks.length}</p>
                  </div>
                  <div className="glass-soft rounded-2xl px-4 py-3">
                    <p className="text-sm text-slate-600">Completed</p>
                    <p className="mt-1 text-2xl font-semibold">{completedTasks}</p>
                  </div>
                  <div className="glass-soft rounded-2xl px-4 py-3">
                    <p className="text-sm text-slate-600">Remaining</p>
                    <p className="mt-1 text-2xl font-semibold">{tasks.length - completedTasks}</p>
                  </div>
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <TaskInput onAddTask={addTask} />

                <section className="glass-panel rounded-3xl p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">Recent tasks</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        A quick look at the latest items in your list.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("tasks")}
                      className="glass-button rounded-2xl px-4 py-2 text-sm font-medium text-slate-900"
                    >
                      Open Tasks
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {recentTasks.length === 0 ? (
                      <div className="glass-soft rounded-2xl p-5 text-sm text-slate-500">
                        No tasks yet. Add one from the form to get started.
                      </div>
                    ) : (
                      recentTasks.map((task) => (
                        <div
                          key={task.id}
                          className="glass-soft flex items-start justify-between gap-3 rounded-2xl p-4"
                        >
                          <div className="min-w-0">
                            <p
                              className={`font-medium ${
                                task.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}
                            >
                              {task.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {task.steps.filter((step) => step.completed).length}/{task.steps.length}{" "}
                              steps complete
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveSection("tasks")}
                            className="text-sm font-medium text-blue-700"
                          >
                            View
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </>
          ) : (
            <>
              <section className="glass-panel rounded-[2rem] px-6 py-8 text-slate-900 sm:px-8">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-600">
                  Task management
                </p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Tasks</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Create, update, and track every task in your main work area.
                </p>
              </section>

              <section className="space-y-4">
                {hasLoaded && tasks.length === 0 ? (
                  <div className="glass-panel rounded-3xl border border-dashed border-white/40 p-10 text-center">
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
                      onUpdateStep={updateStep}
                    />
                  ))
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
