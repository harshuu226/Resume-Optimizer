export default function AtsScore({ score }) {
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';
  const bgColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  const circumference = 2 * Math.PI * 36;
  const strokeDash = circumference - (score / 100) * circumference;

  return (
    <div className="card p-6 flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">ATS Score</h3>
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6"
            className="text-surface-200 dark:text-surface-700" />
          <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6"
            className={bgColor.replace('bg-', 'stroke-')}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold font-mono ${color}`}>{score}</span>
        </div>
      </div>
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
        score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
        score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {label}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {score >= 80 ? 'Great keyword match' : score >= 60 ? 'Some keywords missing' : 'Many keywords missing'}
      </p>
    </div>
  );
}
