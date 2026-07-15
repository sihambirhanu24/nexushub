import { useState, useEffect } from 'react';
import { Users, ClipboardList, Package, CheckCircle, Clock, UserCheck, ArrowRight, TrendingUp } from 'lucide-react';
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

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isStaff = user?.role === 'staff';

  // Filter data based on role
  const myRequests = requests.filter((r) => r.requested_by === user?.id || r.requested_by_name === user?.name);
  const departmentMembers = members.filter((m) => m.department === user?.department);
  const departmentRequests = requests.filter((r) => r.department === user?.department);

  // Stats based on role
  const totalMembers = isAdmin ? members.length : departmentMembers.length;
  const activeMembers = isAdmin
    ? members.filter((m) => m.status === 'active').length
    : departmentMembers.filter((m) => m.status === 'active').length;
  const totalRequests = isAdmin ? requests.length : isManager ? requests.length : myRequests.length;
  const totalResources = resources.length;
  const pendingRequests = isAdmin
    ? requests.filter((r) => r.status === 'pending').length
    : isStaff
    ? myRequests.filter((r) => r.status === 'pending').length
    : requests.filter((r) => r.status === 'pending').length;
  const completedRequests = isAdmin
    ? requests.filter((r) => r.status === 'completed').length
    : isStaff
    ? myRequests.filter((r) => r.status === 'completed').length
    : requests.filter((r) => r.status === 'completed').length;
  const inProgressRequests = isAdmin
    ? requests.filter((r) => r.status === 'in-progress').length
    : isStaff
    ? myRequests.filter((r) => r.status === 'in-progress').length
    : requests.filter((r) => r.status === 'in-progress').length;
  const availableResources = resources.filter((r) => r.status === 'available').length;

  // Cards based on role
  const adminCards = [
    { label: 'Total Members', value: totalMembers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'Active Members', value: activeMembers, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Total Requests', value: totalRequests, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Total Resources', value: totalResources, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Pending', value: pendingRequests, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Completed', value: completedRequests, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  const managerCards = [
    { label: 'Dept Members', value: departmentMembers.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'Active Members', value: activeMembers, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'All Requests', value: totalRequests, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Pending', value: pendingRequests, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'In Progress', value: inProgressRequests, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Completed', value: completedRequests, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  const staffCards = [
    { label: 'My Requests', value: myRequests.length, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Pending', value: myRequests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'In Progress', value: myRequests.filter(r => r.status === 'in-progress').length, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Completed', value: myRequests.filter(r => r.status === 'completed').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Available Resources', value: availableResources, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Total Resources', value: totalResources, icon: Package, color: 'text-gray-400', bg: 'bg-gray-700/50', border: 'border-gray-700' },
  ];

  const cards = isAdmin ? adminCards : isManager ? managerCards : staffCards;

  // Recent activity based on role
  const recentMembers = isAdmin
    ? [...members].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    : [...departmentMembers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const recentRequests = isStaff
    ? [...myRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    : [...requests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const recentResources = [...resources]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const statusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'cancelled': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const resourceStatusStyle = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'in-use': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  const roleLabel = isAdmin
    ? 'System-wide overview'
    : isManager
    ? `${user?.department} department overview`
    : 'Your personal overview';

  const roleBadge = isAdmin
    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
    : isManager
    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">{roleLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleBadge}`}>
              {user?.role}
            </span>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-gray-400">
                <span className="text-white font-medium">{inProgressRequests}</span> in progress
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label}
                className={`bg-gray-900 border ${card.border} rounded-xl p-4 hover:border-opacity-60 transition-all hover:scale-[1.02] cursor-default`}>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Request Overview Bar — hidden for staff (too few requests to be useful) */}
        {!isStaff && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-white">
                {isManager ? 'Department Request Overview' : 'System Request Overview'}
              </h2>
              <Link to="/requests" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap mb-2">
              {[
                { label: 'Pending', value: pendingRequests, color: 'bg-yellow-400' },
                { label: 'In Progress', value: inProgressRequests, color: 'bg-blue-400' },
                { label: 'Completed', value: completedRequests, color: 'bg-emerald-400' },
                { label: 'Total', value: totalRequests, color: 'bg-indigo-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className="text-xs font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            {totalRequests > 0 && (
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
                <div className="bg-yellow-400 h-full transition-all" style={{ width: `${(pendingRequests / totalRequests) * 100}%` }} />
                <div className="bg-blue-400 h-full transition-all" style={{ width: `${(inProgressRequests / totalRequests) * 100}%` }} />
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(completedRequests / totalRequests) * 100}%` }} />
              </div>
            )}
          </div>
        )}

        {/* Staff: My Requests Overview */}
        {isStaff && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-white">My Request Status</h2>
              <Link to="/requests" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {myRequests.length === 0 ? (
              <p className="text-gray-600 text-sm">You haven't submitted any requests yet.</p>
            ) : (
              <div className="flex gap-4 flex-wrap mb-2">
                {[
                  { label: 'Pending', value: myRequests.filter(r => r.status === 'pending').length, color: 'bg-yellow-400' },
                  { label: 'In Progress', value: myRequests.filter(r => r.status === 'in-progress').length, color: 'bg-blue-400' },
                  { label: 'Completed', value: myRequests.filter(r => r.status === 'completed').length, color: 'bg-emerald-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Members panel — hidden for staff */}
          {!isStaff && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <h2 className="text-white font-medium text-sm">
                    {isManager ? 'Dept Team Members' : 'New Team Members'}
                  </h2>
                </div>
                <Link to="/members" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentMembers.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No members yet.</p>
                ) : (
                  recentMembers.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-semibold shrink-0">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-200 text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.department || 'Unassigned'} · {timeAgo(m.created_at)}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize
                        ${m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-700/50 text-gray-400 border border-gray-700'}`}>
                        {m.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Work Requests */}
          <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${isStaff ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h2 className="text-white font-medium text-sm">
                  {isStaff ? 'My Recent Requests' : 'New Work Requests'}
                </h2>
              </div>
              <Link to="/requests" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentRequests.length === 0 ? (
                <div className="text-center py-6">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-gray-600 text-sm">
                    {isStaff ? "You haven't submitted any requests yet." : "No requests yet."}
                  </p>
                  {isStaff && (
                    <Link to="/requests" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
                      Submit your first request →
                    </Link>
                  )}
                </div>
              ) : (
                recentRequests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-200 text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.request_number} · {timeAgo(r.created_at)}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resources */}
          <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${isStaff ? 'lg:col-span-1' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <h2 className="text-white font-medium text-sm">
                  {isStaff ? 'Available Resources' : 'Recently Added Resources'}
                </h2>
              </div>
              <Link to="/resources" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentResources.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No resources yet.</p>
              ) : (
                (isStaff
                  ? resources.filter(r => r.status === 'available').slice(0, 5)
                  : recentResources
                ).map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Package className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-200 text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.resource_code} · {r.category}</p>
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