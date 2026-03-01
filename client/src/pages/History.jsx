import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { SkeletonCard } from '../components/Skeleton';

const ScoreBadge = ({ score }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
    score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
    score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }`}>
    ATS {score}%
  </span>
);

export default function History() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchResumes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/resumes?page=${page}&limit=5`);
      setResumes(res.data.resumes);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  const loadDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/resumes/${id}`);
      setSelected(res.data.resume);
    } catch { toast.error('Failed to load resume'); }
    finally { setDetailLoading(false); }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this optimization? This cannot be undone.')) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Deleted');
      if (selected?._id === id) setSelected(null);
      fetchResumes(pagination.page);
    } catch { toast.error('Failed to delete'); }
  };

  useEffect(() => { fetchResumes(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Optimization History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{pagination.total} total optimizations</p>
        </div>
        <Link to="/dashboard" className="btn-primary text-sm">+ New Optimization</Link>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : resumes.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">No optimizations yet</h3>
          <p className="text-sm text-slate-400 mb-5">Upload your first resume to get started</p>
          <Link to="/dashboard" className="btn-primary text-sm">Optimize My Resume</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {resumes.map(r => (
              <div key={r._id}
                onClick={() => loadDetail(r._id)}
                className={`card p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${selected?._id === r._id ? 'ring-2 ring-brand-500 shadow-md' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{r.fileName || 'Resume'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <ScoreBadge score={r.atsScore} />
                </div>
                {r.jobDescription && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{r.jobDescription.slice(0, 80)}...</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={e => { e.stopPropagation(); loadDetail(r._id); }}
                    className="text-xs text-brand-500 hover:text-brand-600 font-medium">View</button>
                  <button onClick={e => { e.stopPropagation(); deleteResume(r._id); }}
                    className="text-xs text-red-400 hover:text-red-500 font-medium">Delete</button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button onClick={() => fetchResumes(pagination.page - 1)} disabled={pagination.page === 1}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">‹ Prev</button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {pagination.page} / {pagination.pages}
                </span>
                <button onClick={() => fetchResumes(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Next ›</button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {detailLoading ? <SkeletonCard /> : selected ? (
              <div className="card overflow-hidden animate-slide-up">
                <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{selected.fileName}</h3>
                    <ScoreBadge score={selected.atsScore} />
                  </div>
                  <button onClick={() => {
                    const { jsPDF } = require('jspdf');
                    const doc = new jsPDF();
                    doc.setFontSize(10);
                    const lines = doc.splitTextToSize(selected.improvedText, 170);
                    let y = 20;
                    lines.forEach(line => {
                      if (y > 280) { doc.addPage(); y = 20; }
                      doc.text(line, 20, y); y += 5.5;
                    });
                    doc.save(`resume-${selected._id}.pdf`);
                  }} className="btn-primary text-xs py-1.5 px-3">
                    Download PDF
                  </button>
                </div>
                <div className="p-5 max-h-[480px] overflow-y-auto">
                  <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selected.improvedText}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="card p-12 flex items-center justify-center text-center min-h-[300px]">
                <p className="text-sm text-slate-400">Select an optimization from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
