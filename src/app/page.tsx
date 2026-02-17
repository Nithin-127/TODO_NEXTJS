"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, ListTodo, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for clean tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("nextjs-todo-list-responsive");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse todos", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("nextjs-todo-list-responsive", JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#020617] transition-colors duration-500 flex flex-col items-center">
      {/* Dynamic Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-xl px-4 py-12 sm:py-24 space-y-10">

        {/* iOS Style Responsive Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <ListTodo size={36} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              FocusFlow
            </h1>
            <p className="text-blue-600/80 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              Simple • Aligned • Productive
            </p>
          </div>
        </header>

        {/* Input Card with Responsive Padding */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 p-2 transition-all hover:shadow-blue-500/10">
          <form onSubmit={addTodo} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's your focus today?"
              className="w-full py-5 pl-8 pr-16 bg-transparent text-slate-800 dark:text-white text-lg focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 select-none"
            />
            <button
              type="submit"
              className="absolute right-3 p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:scale-105 active:scale-90 transition-all shadow-lg shadow-blue-600/20"
              aria-label="Add Task"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </form>
        </div>

        {/* Responsive Tasks Container */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white/30 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
              <Sparkles className="text-blue-300 dark:text-blue-900" size={48} />
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight">All caught up!</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Add a task above to begin your flow.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="group flex items-center gap-4 p-5 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-[2rem] border border-white/50 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "flex-shrink-0 transition-all duration-300 transform active:scale-75",
                      todo.completed ? "text-blue-500 scale-110" : "text-slate-200 dark:text-slate-700 hover:text-blue-400"
                    )}
                  >
                    {todo.completed ? (
                      <CheckCircle size={32} strokeWidth={2.5} />
                    ) : (
                      <Circle size={32} strokeWidth={1.5} />
                    )}
                  </button>

                  <span className={cn(
                    "flex-grow text-lg sm:text-xl font-semibold tracking-tight text-slate-700 dark:text-slate-200 transition-all duration-300 truncate",
                    todo.completed && "line-through text-slate-300 dark:text-slate-600 italic opacity-60"
                  )}>
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2.5 text-slate-200 hover:text-red-500 dark:text-slate-800 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Delete Task"
                  >
                    <Trash2 size={22} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responsive Footer Info */}
        {todos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-2">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {todos.filter(t => t.completed).length} OF {todos.length} TASKS COMPLETED
              </span>
            </div>
            <button
              onClick={() => setTodos([])}
              className="text-[10px] sm:text-xs font-black text-red-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-[0.2em]"
            >
              Clear Workspace
            </button>
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 text-slate-300 dark:text-slate-800 text-[10px] font-black uppercase tracking-[0.4em]">
        Clarity First
      </footer>
    </div>
  );
}
