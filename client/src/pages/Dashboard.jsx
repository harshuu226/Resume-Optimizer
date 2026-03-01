import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import api from '../utils/api';
import AtsScore from '../components/AtsScore';
import { SkeletonResult } from '../components/Skeleton';

const UploadIcon = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
  </svg>
);

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('improved');

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) { toast.error('Only PDF or DOCX files accepted (max 10MB)'); return; }
    if (accepted.length > 0) { setFile(accepted[0]); setResult(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleOptimize = async () => {
    if (!file) { toast.error('Please upload a resume file'); return; }
    setLoading(true);
    setResult(null);
    const toastId = toast.loading('Analyzing your resume with AI... This may take 30–60 seconds.');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobDescription', jobDesc);
      const res = await api.post('/resumes/optimize', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.resume);
      toast.success('Resume optimized successfully!', { id: toastId });
      setActiveTab('improved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Optimization failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(result.improvedText, maxWidth);
    let y = margin;
    lines.forEach(line => {
      if (y + 7 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5.5;
    });
    doc.save(`optimized-resume-${Date.now()}.pdf`);
    toast.success('PDF downloaded!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Optimize Resume</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload your resume and get an AI-powered ATS-optimized version</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dropzone */}
          <div className="card p-5">
            <label className="label">Resume File</label>
            <div {...getRootProps()} className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' :
              file ? 'border-brand-400/50 bg-brand-50/50 dark:bg-brand-500/5' :
              'border-surface-300 dark:border-surface-600 hover:border-brand-400 hover:bg-surface-50 dark:hover:bg-surface-700/50'
            }`}>
              <input {...getInputProps()} />
              <div className={`flex flex-col items-center gap-3 ${file ? 'text-brand-500' : 'text-slate-400'}`}>
                {file ? (
                  <>
                    <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p className="font-semibold text-brand-600 dark:text-brand-400 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <div>
                      <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your resume'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PDF or DOCX · Max 10MB</p>
                    </div>
                    <span className="text-xs bg-surface-100 dark:bg-surface-700 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 font-medium">
                      Browse files
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="card p-5">
            <label className="label">
              Job Description
              <span className="text-xs text-slate-400 font-normal ml-1">(optional but recommended)</span>
            </label>
            <textarea
              className="input resize-none h-40"
              placeholder="Paste the job description here to improve ATS keyword matching..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading || !file}
            className="btn-primary w-full justify-center py-3.5 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Optimizing with AI...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Optimize Resume
              </>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          {loading && <SkeletonResult />}

          {!loading && !result && (
            <div className="card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Your optimized resume will appear here</h3>
              <p className="text-sm text-slate-400">Upload a resume and click "Optimize Resume" to get started</p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5 animate-slide-up">
              {/* Score + actions */}
              <div className="flex gap-5 flex-wrap">
                <AtsScore score={result.atsScore} />
                <div className="flex-1 card p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Actions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Your resume has been optimized with stronger bullet points, quantifiable achievements, and better ATS keywords.
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <button onClick={downloadPDF} className="btn-primary text-sm py-2 px-4">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Download PDF
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(result.improvedText); toast.success('Copied!'); }}
                      className="btn-secondary text-sm py-2 px-4">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      Copy Text
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="card overflow-hidden">
                <div className="flex border-b border-surface-200 dark:border-surface-700">
                  {['improved', 'original'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 bg-brand-50/50 dark:bg-brand-500/5'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}>
                      {tab === 'improved' ? '✨ Improved Resume' : 'Original Resume'}
                    </button>
                  ))}
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                  <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeTab === 'improved' ? result.improvedText : result.originalText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
