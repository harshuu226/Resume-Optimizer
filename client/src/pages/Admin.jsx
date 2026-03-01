import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { SkeletonCard } from '../components/Skeleton';

const StatCard = ({ label, value, icon, color }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{value}</p>
  </div>
);

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState({});

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
    } catch { toast.error('Failed to load dashboard'); }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(res.data.users);
      setUsersPagination(res.data.pagination);
    } catch { toast.error('Failed to load users'); }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get('/admin/resumes?limit=20');
      setResumes(res.data.resumes);
    } catch { toast.error('Failed to load resumes'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their resumes?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers(usersPage);
      fetchDashboard();
    } catch { toast.error('Failed to delete user'); }
  };

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchUsers(), fetchResumes()]).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-3">
          Admin Panel
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-50 dark:bg-blue-500/10 text-blue-500"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
        />
        <StatCard label="Total Optimizations" value={stats?.totalResumes || 0} color="bg-purple-50 dark:bg-purple-500/10 text-purple-500"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
        />
        <StatCard label="Avg ATS Score" value={`${stats?.avgAtsScore || 0}%`} color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
        {['overview', 'users', 'resumes'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-white dark:bg-surface-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats?.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
                  {['User', 'Email', 'Resumes', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-md">{u.resumeCount}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => deleteUser(u._id)} className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usersPagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-surface-200 dark:border-surface-700">
              <button onClick={() => { setUsersPage(p => p-1); fetchUsers(usersPage-1); }} disabled={usersPage === 1}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">‹ Prev</button>
              <span className="text-xs text-slate-500">{usersPage} / {usersPagination.pages}</span>
              <button onClick={() => { setUsersPage(p => p+1); fetchUsers(usersPage+1); }} disabled={usersPage === usersPagination.pages}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Next ›</button>
            </div>
          )}
        </div>
      )}

      {tab === 'resumes' && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
                  {['File', 'User', 'ATS Score', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {resumes.map(r => (
                  <tr key={r._id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{r.fileName}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{r.userId?.name || 'Deleted User'}</td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-xs font-bold px-2 py-1 rounded-full ${
                        r.atsScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        r.atsScore >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>{r.atsScore}%</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
