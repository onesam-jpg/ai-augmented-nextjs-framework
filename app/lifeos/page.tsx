import Link from 'next/link';

export default function LifeOSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-2">
            🌟 LifeOS Dashboard
          </h1>
          <p className="text-purple-200">
            AI-Powered Life Operating System
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Google Calendar Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">📅 Calendar</h3>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                Connected
              </span>
            </div>
            <p className="text-purple-200 text-sm">
              Google Calendar synced and ready
            </p>
          </div>

          {/* Notion Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">📝 Notion</h3>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                Connected
              </span>
            </div>
            <p className="text-purple-200 text-sm">
              8 databases accessible
            </p>
          </div>

          {/* MCP Servers Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">🤖 AI Agents</h3>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                Ready
              </span>
            </div>
            <p className="text-purple-200 text-sm">
              3 MCP servers active
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Task Card */}
          <Link
            href="/lifeos/create-task"
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Create Task</h2>
              <span className="text-4xl group-hover:scale-110 transition-transform">
                ➕
              </span>
            </div>
            <p className="text-purple-100 mb-4">
              Add a new task to Notion and auto-schedule it in Google Calendar
            </p>
            <div className="flex items-center text-white/80">
              <span className="mr-2">→</span>
              <span>Start here</span>
            </div>
          </Link>

          {/* View Tasks Card */}
          <Link
            href="/lifeos/tasks"
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Today&apos;s Tasks</h2>
              <span className="text-4xl group-hover:scale-110 transition-transform">
                📋
              </span>
            </div>
            <p className="text-blue-100 mb-4">
              View your active tasks and upcoming calendar events
            </p>
            <div className="flex items-center text-white/80">
              <span className="mr-2">→</span>
              <span>View tasks</span>
            </div>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🗓️</div>
            <h4 className="text-white font-semibold mb-1">Smart Scheduling</h4>
            <p className="text-purple-200 text-xs">AI finds optimal time slots</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="text-white font-semibold mb-1">Two-Way Sync</h4>
            <p className="text-purple-200 text-xs">Notion ↔ Calendar</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="text-white font-semibold mb-1">Priority Engine</h4>
            <p className="text-purple-200 text-xs">Auto-calculates urgency</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🕌</div>
            <h4 className="text-white font-semibold mb-1">Non-Deferrables</h4>
            <p className="text-purple-200 text-xs">Sacred time blocks</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">⚡ Quick Stats</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-1">0</div>
              <div className="text-purple-200 text-sm">Tasks Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-300 mb-1">0</div>
              <div className="text-blue-200 text-sm">Synced Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300 mb-1">0</div>
              <div className="text-cyan-200 text-sm">Minutes Focused</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300 mb-1">0</div>
              <div className="text-green-200 text-sm">Completed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>🤖 Powered by Claude Code + MCP Servers</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 underline mt-2 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
