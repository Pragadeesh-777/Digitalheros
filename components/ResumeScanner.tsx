'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Download, 
  Bookmark,
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FileText,
  Percent,
  ListFilter
} from 'lucide-react';
import { analyzeResume } from '../lib/ai-engine';
import { ResumeAnalysis } from '../types';

interface ResumeScannerProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function ResumeScanner({ onAddActivity, onSaveNote, showToast }: ResumeScannerProps) {
  const [resumeText, setResumeText] = useState(`Jane Doe
Email: jane.doe@email.com | Phone: 123-456-7890 | LinkedIn: linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Dynamic Software Engineer with 2+ years of experience specializing in frontend React applications.

EDUCATION
B.Tech in Information Technology - KIOT (CGPA: 8.5)

EXPERIENCE
Frontend Developer at TechSolutions (2024 - Present)
- Developed responsive web interfaces using React, Next.js, and Tailwind CSS.
- Optimized app loading times by 30% using image lazy loading and tree shaking.
- Managed state integration using Redux Toolkit.

SKILLS
React, Next.js, TypeScript, JavaScript, CSS, HTML, Tailwind CSS, Git, REST APIs, Agility, Problem Solving`);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleScan = () => {
    if (!resumeText.trim()) {
      showToast('Please paste your resume text to scan.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const result = analyzeResume(resumeText);
      setAnalysis(result);
      setIsPending(false);
      showToast('Resume scanned successfully!', 'success');
      onAddActivity(
        'Resume Scanned', 
        `Evaluated resume text - ATS score: ${result.atsScore}%`, 
        'resume'
      );
    }, 800);
  };

  const handleClear = () => {
    setResumeText('');
    setAnalysis(null);
    showToast('Form cleared.', 'info');
  };

  const handleDownload = () => {
    if (!analysis) return;
    const content = 
      `RESUME ATS SCANNER ANALYSIS REPORT\n` +
      `==================================\n` +
      `ATS Score: ${analysis.atsScore}/100\n` +
      `Formatting Quality: ${analysis.formattingQuality}\n\n` +
      `DETECTED SKILLS:\n${analysis.skillsDetected.map(s => `* ${s}`).join('\n') || 'None'}\n\n` +
      `RECOMMENDED MISSING KEYWORDS:\n${analysis.missingKeywords.map(k => `* ${k}`).join('\n') || 'None'}\n\n` +
      `WEAK SECTIONS FOUND:\n${analysis.weakSections.map(w => `* ${w}`).join('\n') || 'None'}\n\n` +
      `SUGGESTED IMPROVEMENTS:\n${analysis.suggestedImprovements.map(i => `* ${i}`).join('\n')}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_ats_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded text report successfully!', 'success');
  };

  const handleSaveReport = () => {
    if (!analysis) return;
    
    const noteContent = 
      `**ATS Matching Score:** ${analysis.atsScore}/100\n` +
      `**Formatting Quality:** ${analysis.formattingQuality}\n\n` +
      `**Detected Skills:** ${analysis.skillsDetected.join(', ') || 'None'}\n\n` +
      `**Missing Keywords:** ${analysis.missingKeywords.join(', ') || 'None'}\n\n` +
      `**Suggested Improvements:**\n${analysis.suggestedImprovements.map(i => `• ${i}`).join('\n')}`;
      
    onSaveNote(`Resume ATS Report (${analysis.atsScore}%)`, noteContent, 'resume');
    showToast('Report saved to Export Center!', 'success');
  };

  // Color matching helper for score
  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500 border-red-500/20 bg-red-500/5';
    if (score < 75) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
  };

  const getFormatBadgeColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10';
      case 'Good': return 'bg-teal-500/10 text-teal-500 border-teal-500/10';
      case 'Fair': return 'bg-amber-500/10 text-amber-500 border-amber-500/10';
      default: return 'bg-red-500/10 text-red-500 border-red-500/10';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Resume ATS Scanner</h2>
          <p className="text-xs text-muted-foreground">Scan your resume against ATS search algorithms to optimize layout scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Paste Resume Box */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-md font-bold font-heading flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-teal-500" /> Resume Text Inspector
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
              <span>Paste Resume Text</span>
              <span className="text-[10px] text-muted-foreground font-normal">{resumeText.length} chars</span>
            </label>
            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the complete text from your PDF/Word resume here. Include your contact details, education, work history, skills, and projects."
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleScan}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running ATS Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Scan Resume
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border px-3 py-2.5 rounded-lg transition-all"
              title="Clear Draft"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Output Panel */}
        {analysis ? (
          <div className="space-y-6">
            
            {/* Top Score Banner */}
            <div className={`p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${getScoreColor(analysis.atsScore)}`}>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">ATS Score Indicator</h4>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {analysis.atsScore >= 80 
                    ? 'Excellent score! Your resume meets high-density keywords and structural formatting for automated job screens.'
                    : analysis.atsScore >= 60 
                    ? 'Fair match score. Add more relevant tech skills and verify missing sections to pass the 75%+ threshold.'
                    : 'Critical alerts found. Add standard structural headers and enrich tech keyword density to bypass automated spam filters.'}
                </p>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <div className="relative flex items-center justify-center">
                  {/* Circular visual progress */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold font-heading">{analysis.atsScore}%</span>
                </div>
              </div>
            </div>

            {/* General Assessment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl glass-panel space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Formatting Quality</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getFormatBadgeColor(analysis.formattingQuality)}`}>
                    {analysis.formattingQuality}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Section Integrity</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {analysis.weakSections.length === 0 ? (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> All core sections found
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {analysis.weakSections.length} core sections missing
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Detected Skills */}
            <div className="p-5 rounded-xl glass-panel space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Detected Core Skills ({analysis.skillsDetected.length})
              </h4>
              {analysis.skillsDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsDetected.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-teal-500/10 text-teal-400 font-semibold px-2 py-0.5 rounded border border-teal-500/10">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No technical skills detected. Please enrich your text list.</p>
              )}
            </div>

            {/* Missing Keywords & Section Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Missing keywords */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Recommended Keywords
                </h4>
                {analysis.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-[9px] bg-purple-500/10 text-purple-400 font-semibold px-2 py-0.5 rounded border border-purple-500/10">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Perfect match density.</p>
                )}
              </div>

              {/* Weak sections */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Missing Headers
                </h4>
                {analysis.weakSections.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.weakSections.map((sec, idx) => (
                      <span key={idx} className="text-[9px] bg-red-500/10 text-red-400 font-semibold px-2 py-0.5 rounded border border-red-500/10">
                        {sec}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-emerald-500">Perfect section flow.</p>
                )}
              </div>

            </div>

            {/* Recommendations */}
            <div className="p-5 rounded-xl glass-panel space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">Actionable Suggestions</h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                {analysis.suggestedImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-500">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-card-border mt-4">
                <button
                  onClick={handleSaveReport}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border font-semibold text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save Analysis
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 font-semibold text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Report
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <FileText className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
            <h3 className="font-semibold text-sm">No resume scan performed yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Paste your resume raw text in the left panel to scan keywords against standard ATS metrics.</p>
          </div>
        )}

      </div>

    </div>
  );
}
