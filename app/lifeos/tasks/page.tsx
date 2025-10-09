'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  category: string;
  due?: string;
  impactScore?: number;
  effort?: string;
  whyItMatters?: string;
  nextBite?: string;
  nonDeferrable?: boolean;
  calendarEventId?: string;
  calendarEventLink?: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  htmlLink: string;
  colorId?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lifeos/tasks');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      setTasks(data.tasks || []);
      setEvents(data.events || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-500/10 text-blue-300';
      case 'Personal': return 'bg-purple-500/10 text-purple-300';
      case 'Health': return 'bg-green-500/10 text-green-300';
      case 'Learning': return 'bg-indigo-500/10 text-indigo-300';
      case 'Finance': return 'bg-emerald-500/10 text-emerald-300';
      case 'Spiritual': return 'bg-pink-500/10 text-pink-300';
      default: return 'bg-gray-500/10 text-gray-300';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lifeos" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Today's Tasks</h1>
          <p className="text-gray-400">Active tasks and calendar events</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notion Tasks */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Notion Tasks ({tasks.length})
            </h2>

            {tasks.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
                <p className="text-gray-400 mb-4">No active tasks found</p>
                <Link
                  href="/lifeos/create-task"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Create Your First Task
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white flex-1">{task.name}</h3>
                      {task.nonDeferrable && (
                        <span className="ml-2 bg-pink-500/20 text-pink-300 text-xs px-2 py-1 rounded border border-pink-500/30">
                          🔒 Non-Deferrable
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-3 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      {task.impactScore && (
                        <span className="text-xs px-3 py-1 rounded bg-blue-500/20 text-blue-300">
                          Impact: {task.impactScore}/10
                        </span>
                      )}
                      {task.effort && (
                        <span className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300">
                          {task.effort}
                        </span>
                      )}
                    </div>

                    {task.due && (
                      <p className="text-sm text-gray-400 mb-2">
                        📅 Due: {formatDateTime(task.due)}
                      </p>
                    )}

                    {task.whyItMatters && (
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="font-semibold">Why:</span> {task.whyItMatters}
                      </p>
                    )}

                    {task.nextBite && (
                      <p className="text-sm text-gray-300 mb-3">
                        <span className="font-semibold">Next:</span> {task.nextBite}
                      </p>
                    )}

                    {task.calendarEventLink && (
                      <a
                        href={task.calendarEventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        📆 View in Google Calendar →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Events */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Calendar Events ({events.length})
            </h2>

            {events.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
                <p className="text-gray-400">No events scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3">{event.summary}</h3>

                    <p className="text-sm text-gray-400 mb-2">
                      🕐 {formatDateTime(event.start)} - {formatDateTime(event.end)}
                    </p>

                    {event.description && (
                      <p className="text-sm text-gray-300 mb-3 whitespace-pre-line">
                        {event.description}
                      </p>
                    )}

                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Open in Google Calendar →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchTasks}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
