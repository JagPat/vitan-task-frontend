import React, { useEffect, useState } from 'react';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

const AdminAnalytics = () => {
  const [logs, setLogs] = useState([]);
  const [perf, setPerf] = useState(null);
  const [insights, setInsights] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  const [waStats, setWaStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        await Promise.all([
          loadLogs(),
          loadPerf(),
          loadInsights(),
          loadAiUsage(),
          loadWaStats()
        ]);
      } catch (e) {
        setError('Failed to load analytics');
      }
    };
    run();
  }, []);

  async function loadLogs() {
    const res = await fetch(`${API_BASE}/api/modules/system/logs`);
    if (!res.ok) throw new Error('logs');
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
    setLogs(list);
  }
  async function loadPerf() {
    const res = await fetch(`${API_BASE}/api/modules/analytics/performance`);
    if (!res.ok) throw new Error('performance');
    setPerf(await res.json());
  }
  async function loadInsights() {
    const res = await fetch(`${API_BASE}/api/modules/analytics/insights`);
    if (!res.ok) throw new Error('insights');
    setInsights(await res.json());
  }
  async function loadAiUsage() {
    const res = await fetch(`${API_BASE}/api/modules/analytics/ai-usage`);
    if (!res.ok) throw new Error('ai-usage');
    setAiUsage(await res.json());
  }
  async function loadWaStats() {
    const res = await fetch(`${API_BASE}/api/modules/analytics/whatsapp-stats`);
    if (!res.ok) throw new Error('whatsapp-stats');
    setWaStats(await res.json());
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">System Logs & Analytics</h2>

      <section className="bg-white rounded shadow p-4">
        <h3 className="font-medium text-gray-800 mb-2">Recent Logs</h3>
        <div className="max-h-80 overflow-auto text-sm">
          {logs.length === 0 ? 'No logs' : logs.map((line, i) => (
            <div key={i} className="font-mono whitespace-pre-wrap text-gray-700 border-b last:border-b-0 py-1">{String(line)}</div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium text-gray-800 mb-2">Performance</h3>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{perf ? JSON.stringify(perf, null, 2) : 'Loading...'}</pre>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium text-gray-800 mb-2">Insights</h3>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{insights ? JSON.stringify(insights, null, 2) : 'Loading...'}</pre>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium text-gray-800 mb-2">AI Usage</h3>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{aiUsage ? JSON.stringify(aiUsage, null, 2) : 'Loading...'}</pre>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium text-gray-800 mb-2">WhatsApp Stats</h3>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">{waStats ? JSON.stringify(waStats, null, 2) : 'Loading...'}</pre>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;




