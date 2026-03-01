import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Feature = ({ icon, title, desc }) => (
  <div className="card p-6 hover:shadow-md transition-shadow duration-300">
    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4 text-brand-500">
      {icon}
    </div>
    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-500/10 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
            AI-Powered Resume Optimization
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            Land your dream job<br />
            <span className="text-brand-500">with a better resume</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your resume, paste the job description, and get an ATS-optimized version with stronger bullet points and measurable achievements — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary text-base px-7 py-3">
              Optimize My Resume →
            </Link>
            {!user && <Link to="/login" className="btn-secondary text-base px-7 py-3">Sign in</Link>}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Everything you need</h2>
          <p className="text-slate-500 dark:text-slate-400">Stop getting filtered out by ATS systems before humans even see your resume.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>} title="ATS Score" desc="See exactly how well your resume matches the job description with keyword analysis." />
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>} title="AI Rewriting" desc="Claude rewrites weak bullet points into compelling, action-oriented achievements." />
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>} title="Measurable Metrics" desc="Automatically adds quantifiable achievements — percentages, revenue, team sizes." />
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>} title="PDF Download" desc="Download your optimized resume as a clean PDF ready to submit." />
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} title="History" desc="Access all your past optimizations and compare different versions." />
          <Feature icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>} title="Easy Upload" desc="Drag and drop PDF or DOCX files. We handle the parsing automatically." />
        </div>
      </section>
    </div>
  );
}
