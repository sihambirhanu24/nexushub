import { useState, useEffect } from 'react';
import { Users, ClipboardList, Package, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, requestsRes, resourcesRes] = await Promise.all([
          api.get('/members'),
          api.get('/requests'),
          api.get('/resources'),
        ]);
        setMembers(membersRes.data);
        setRequests(requestsRes.data.requests || requestsRes.data);
        setResources(resourcesRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const totalRequests = requests.length;
  const totalResources = resources.length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const completedRequests = requests.filter((r) => r.status === 'completed').length;

  const cards = [
    { label: 'Total Team Members', value: totalMembers, icon: Users },
    { label: 'Active Members', value: activeMembers, icon: Users },
    { label: 'Total Work Requests', value: totalRequests, icon: ClipboardList },
    { label: 'Total Resources', value: totalResources, icon: Package },
    { label: 'Pending Requests', value: pendingRequests, icon: ClipboardList },
    { label: 'Completed Requests', value: completedRequests, icon: CheckCircle },
  ];

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);
  const recentResources = [...resources]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-gray-400">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Operations Overview</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome back — here's what's happening.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <Icon className="w-4 h-4 text-indigo-400 mb-2" />
                <p className="text-2xl font-semibold text-white">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4 text-sm">New Team Members</h2>
            <div className="space-y-3">
              {recentMembers.length === 0 ? (
                <p className="text-gray-600 text-sm">No members yet.</p>
              ) : (
                recentMembers.map((m) => (
                  <div key={m.id} className="text-sm">
                    <p className="text-gray-300">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.department || 'Unassigned'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4 text-sm">New Work Requests</h2>
            <div className="space-y-3">
              {recentRequests.length === 0 ? (
                <p className="text-gray-600 text-sm">No requests yet.</p>
              ) : (
                recentRequests.map((r) => (
                  <div key={r.id} className="text-sm">
                    <p className="text-gray-300">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.request_number}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4 text-sm">Recently Added Resources</h2>
            <div className="space-y-3">
              {recentResources.length === 0 ? (
                <p className="text-gray-600 text-sm">No resources yet.</p>
              ) : (
                recentResources.map((r) => (
                  <div key={r.id} className="text-sm">
                    <p className="text-gray-300">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.resource_code}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;