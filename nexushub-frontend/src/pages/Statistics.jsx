import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-gray-400">Loading statistics...</div>
      </Layout>
    );
  }

  const BarGroup = ({ title, data, labelKey }) => {
    const maxCount = Math.max(...data.map((d) => parseInt(d.count)), 1);
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-medium mb-4">{title}</h2>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item[labelKey]}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{item[labelKey] || 'Unassigned'}</span>
                <span>{item.count}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${(parseInt(item.count) / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Statistics</h1>
        <p className="text-gray-500 text-sm mb-6">System-wide insights and trends.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BarGroup title="Members per Department" data={stats.membersByDepartment} labelKey="department" />
          <BarGroup title="Requests by Status" data={stats.requestsByStatus} labelKey="status" />
          <BarGroup title="Resources by Category" data={stats.resourcesByCategory} labelKey="category" />
          <BarGroup title="Members by Status" data={stats.membersByStatus} labelKey="status" />
        </div>
      </div>
    </Layout>
  );
}

export default Statistics;