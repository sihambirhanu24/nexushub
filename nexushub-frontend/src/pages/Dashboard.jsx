import { useState, useEffect } from 'react';
import { Users, ClipboardList, Package, CheckCircle, Clock, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
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
    { label: 'Total Team Members', value: totalMembers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Members', value: activeMembers, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Work Requests', value: totalRequests, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Resources', value: totalResources, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Completed Requests', value: completedRequests, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const recentResources = [...resources]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const statusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400';
      case 'cancelled': return 'bg-gray-700 text-gray-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  const resourceStatusStyle = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400';
      case 'in-use': return 'bg-blue-500/10 text-blue-400';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening across your organization today.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* New Team Members */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <h2 className="text-white font-medium text-sm">New Team Members</h2>
              </div>
              <Link to="/members" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentMembers.length === 0 ? (
                <p className="text-gray-600 text-sm">No members yet.</p>
              ) : (
                recentMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-300 text-sm truncate">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.department || 'Unassigned'}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                      {m.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New Work Requests */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h2 className="text-white font-medium text-sm">New Work Requests</h2>
              </div>
              <Link to="/requests" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentRequests.length === 0 ? (
                <p className="text-gray-600 text-sm">No requests yet.</p>
              ) : (
                recentRequests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-300 text-sm truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.request_number}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Added Resources */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <h2 className="text-white font-medium text-sm">Recently Added Resources</h2>
              </div>
              <Link to="/resources" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentResources.length === 0 ? (
                <p className="text-gray-600 text-sm">No resources yet.</p>
              ) : (
                recentResources.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-300 text-sm truncate">{r.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.resource_code}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${resourceStatusStyle(r.status)}`}>
                      {r.status}
                    </span>
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