'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  const [result, setResult] = useState<any>(null);

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
        // Reset form
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lifeos" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            ➕ Create New Task
          </h1>
          <p className="text-purple-200">
            Task will be added to Notion and auto-scheduled in Google Calendar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          {/* Task Name */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Task Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Write project proposal"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Personal">Personal</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Content">Content</option>
                <option value="Books">Books</option>
                <option value="Admin">Admin</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>

          {/* Due Date & Impact Score */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                name="due"
                value={formData.due}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Impact Score (0-10)
              </label>
              <input
                type="number"
                name="impactScore"
                value={formData.impactScore}
                onChange={handleChange}
                min="0"
                max="10"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Effort & Non-Deferrable */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Effort Estimate
              </label>
              <select
                name="effort"
                value={formData.effort}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Quick (15min)">Quick (15min)</option>
                <option value="Short (1hr)">Short (1hr)</option>
                <option value="Medium (half day)">Medium (half day)</option>
                <option value="Long (full day+)">Long (full day+)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Non-Deferrable? (Prayer, Family)
              </label>
              <select
                name="nonDeferrable"
                value={formData.nonDeferrable}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="false">No</option>
                <option value="true">Yes (Sacred Block)</option>
              </select>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Why It Matters (Motivation)
            </label>
            <textarea
              name="whyItMatters"
              value={formData.whyItMatters}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What impact will this have? Why is it important?"
            />
          </div>

          {/* Next Bite */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Next Bite (First Action)
            </label>
            <input
              type="text"
              name="nextBite"
              value={formData.nextBite}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What's the immediate first step?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '🔄 Creating Task & Syncing Calendar...' : '✨ Create Task & Sync to Calendar'}
          </button>
        </form>

        {/* Result Message */}
        {result && (
          <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
            {result.success ? (
              <div>
                <h3 className="text-green-300 font-bold text-xl mb-2">✅ Success!</h3>
                <p className="text-green-200 mb-2">Task created in Notion and synced to Google Calendar</p>
                <a
                  href={result.calendarEvent}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline hover:text-green-200"
                >
                  📅 View in Google Calendar →
                </a>
              </div>
            ) : (
              <div>
                <h3 className="text-red-300 font-bold text-xl mb-2">❌ Error</h3>
                <p className="text-red-200">{result.error}</p>
                <p className="text-red-300 text-sm mt-2">
                  💡 Make sure you&apos;ve shared your Notion databases with the integration and fixed the schema.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
