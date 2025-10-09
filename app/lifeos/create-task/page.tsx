'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function CreateTaskPage() {
  const [formData, setFormData] = useState({
    name: '',
    priority: 'Medium',
    category: 'Personal',
    due: '',
    impactScore: '5',
    effort: 'Short (1hr)',
    whyItMatters: '',
    nextBite: '',
    nonDeferrable: 'false'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string; calendarEvent?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/lifeos/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setFormData({
          name: '',
          priority: 'Medium',
          category: 'Personal',
          due: '',
          impactScore: '5',
          effort: 'Short (1hr)',
          whyItMatters: '',
          nextBite: '',
          nonDeferrable: 'false'
        });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <ThemeToggle />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/lifeos" className="inline-flex items-center gap-2 mb-6 transition-colors hover:opacity-70" style={{ color: 'var(--accent-blue)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-blue)' }}>
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Create New Task
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Task will be added to Notion and auto-scheduled in Google Calendar
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: 'var(--bg-elevated)', boxShadow: 'var(--shadow-xl)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Task Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }} placeholder="What needs to be done?" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Priority *</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                  <option>Personal</option>
                  <option>Work</option>
                  <option>Health</option>
                  <option>Learning</option>
                  <option>Finance</option>
                  <option>Spiritual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Due Date & Time *</label>
                <input type="datetime-local" name="due" required value={formData.due} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Impact Score (0-10)</label>
                <input type="number" name="impactScore" min="0" max="10" value={formData.impactScore} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Effort Estimate</label>
                <select name="effort" value={formData.effort} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                  <option>Quick (15min)</option>
                  <option>Short (1hr)</option>
                  <option>Medium (half day)</option>
                  <option>Long (full day+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Non-Deferrable?</label>
                <select name="nonDeferrable" value={formData.nonDeferrable} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                  <option value="false">No</option>
                  <option value="true">Yes (Sacred Block)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Why It Matters</label>
              <textarea name="whyItMatters" value={formData.whyItMatters} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all resize-none" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }} placeholder="What impact will this have?" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Next Bite</label>
              <input type="text" name="nextBite" value={formData.nextBite} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }} placeholder="What's the first step?" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--accent-blue)' }}>
              {loading ? 'Creating...' : '✨ Create Task & Sync to Calendar'}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-6 p-6 rounded-2xl" style={{ backgroundColor: result.success ? 'var(--success-bg)' : 'var(--error-bg)', borderLeft: `4px solid ${result.success ? 'var(--success)' : 'var(--error)'}`, color: result.success ? 'var(--success)' : 'var(--error)' }}>
            <p className="font-semibold">{result.success ? '✅ Success!' : '❌ Error'}</p>
            <p className="text-sm mt-1">{result.success ? 'Task created in Notion and synced to Google Calendar' : result.error}</p>
            {result.success && result.calendarEvent && (
              <a href={result.calendarEvent} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-medium hover:underline">📅 View in Calendar →</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
