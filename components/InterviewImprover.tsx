'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Trash2, 
  Download, 
  Bookmark,
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Brain,
  Video
} from 'lucide-react';
import { analyzeInterviewAnswer } from '../lib/ai-engine';
import { InterviewAnalysis } from '../types';

interface InterviewImproverProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function InterviewImprover({ onAddActivity, onSaveNote, showToast }: InterviewImproverProps) {
  const [question, setQuestion] = useState('Describe a conflict you had with a team member and how you handled it.');
  const [answer, setAnswer] = useState('We were building a NextJS dashboard. A designer wanted to use Tailwind for custom gradients but the backend engineer wanted raw CSS. They were arguing. I stepped in and showed them we could declare custom Tailwind colors in tailwind.config.js to satisfy both. They agreed and we finished the dashboard successfully.');
  const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
  const [isPending, setIsPending] = useState(false);

  const sampleQuestions = [
    "Tell me about a time you resolved a major bug in production.",
    "Why do you want to work as a Software Developer at our company?",
    "Describe a conflict you had with a team member and how you handled it.",
    "What is your greatest technical strength?"
  ];

  const handleAnalyze = () => {
    if (!question.trim()) {
      showToast('Please specify the interview question.', 'error');
      return;
    }
    if (!answer.trim()) {
      showToast('Please type your draft answer to improve.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const result = analyzeInterviewAnswer(question, answer);
      setAnalysis(result);
      setIsPending(false);
      showToast('Interview response analyzed successfully!', 'success');
      onAddActivity(
        'Interview Response Optimized', 
        `Evaluated answer to "${question.substring(0, 30)}..." - confidence score: ${result.metrics.confidenceScore}%`, 
        'interview'
      );
    }, 800);
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    setAnalysis(null);
    showToast('Form cleared.', 'info');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    if (!analysis) return;
    const content = 
      `INTERVIEW ANSWER IMPROVEMENT REPORT\n` +
      `===============================\n` +
      `Question: ${question}\n\n` +
      `Original Answer:\n${answer}\n\n` +
      `METRICS:\n` +
      `- Word Count: ${analysis.metrics.wordCount}\n` +
      `- Reading Time: ${analysis.metrics.readingTime}s\n` +
      `- Confidence Score: ${analysis.metrics.confidenceScore}/100\n` +
      `- Grammar Score: ${analysis.metrics.grammarScore}/100\n` +
      `- Clarity Score: ${analysis.metrics.clarityScore}/100\n` +
      `- Tone Score: ${analysis.metrics.toneScore}/100\n\n` +
      `STRENGTHS:\n${analysis.strengths.map(s => `* ${s}`).join('\n')}\n\n` +
      `WEAKNESSES:\n${analysis.weaknesses.map(w => `* ${w}`).join('\n')}\n\n` +
      `MISSING KEYWORDS: ${analysis.missingKeywords.join(', ') || 'None'}\n\n` +
      `ENHANCED ANSWER:\n${analysis.enhancedAnswer}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview_analysis_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded text report successfully!', 'success');
  };

  const handleSaveReport = () => {
    if (!analysis) return;
    
    const noteContent = 
      `**Question:** ${question}\n\n` +
      `**Enhanced Answer:**\n${analysis.enhancedAnswer}\n\n` +
      `**Confidence Score:** ${analysis.metrics.confidenceScore}/100 | **Clarity:** ${analysis.metrics.clarityScore}/100\n` +
      `**Missing Keywords:** ${analysis.missingKeywords.join(', ') || 'None'}`;
      
    onSaveNote(`Interview Prep: ${question.substring(0, 35)}...`, noteContent, 'interview');
    showToast('Report saved to Export Center!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Interview Answer Improver</h2>
          <p className="text-xs text-muted-foreground">Perfect your answers using STAR-method structural alignments.</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Inputs */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-md font-bold font-heading flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-500" /> Answer Draft Center
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
              <span>Interview Question</span>
              <span className="text-[10px] text-muted-foreground font-normal">Select a sample below or type yours</span>
            </label>
            <input 
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Tell me about a time you led a challenging project."
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            
            {/* Sample Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(q)}
                  className="text-[10px] bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground border border-card-border rounded px-2 py-1 transition-all"
                >
                  {q.substring(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
              <span>Your Draft Answer</span>
              <span className="text-[10px] text-muted-foreground font-normal">{answer.length} chars</span>
            </label>
            <textarea
              rows={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or paste your raw draft answer here. Mention details about situation, tasks, what actions you took, and final results."
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={handleAnalyze}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Improve Answer
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border px-3 py-2.5 rounded-lg transition-all"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Outputs */}
        {analysis ? (
          <div className="space-y-6">
            
            {/* Scoring Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl glass-panel">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
                  <span>Confidence Score</span>
                  <span className="text-teal-500 font-bold">{analysis.metrics.confidenceScore}%</span>
                </div>
                <div className="w-full bg-white/5 dark:bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analysis.metrics.confidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
                  <span>Clarity Score</span>
                  <span className="text-purple-500 font-bold">{analysis.metrics.clarityScore}%</span>
                </div>
                <div className="w-full bg-white/5 dark:bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analysis.metrics.clarityScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
                  <span>Grammar Score</span>
                  <span className="text-indigo-500 font-bold">{analysis.metrics.grammarScore}%</span>
                </div>
                <div className="w-full bg-white/5 dark:bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analysis.metrics.grammarScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
                  <span>Professional Tone</span>
                  <span className="text-pink-500 font-bold">{analysis.metrics.toneScore}%</span>
                </div>
                <div className="w-full bg-white/5 dark:bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analysis.metrics.toneScore}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Read Stats */}
            <div className="flex gap-4 text-[11px] text-muted-foreground px-1">
              <span>Words: <strong className="text-foreground">{analysis.metrics.wordCount}</strong></span>
              <span>Characters: <strong className="text-foreground">{analysis.metrics.charCount}</strong></span>
              <span>Estimated Reading Time: <strong className="text-foreground">{analysis.metrics.readingTime}s</strong></span>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Strengths Detected
                </h4>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Focus Areas
                </h4>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {analysis.weaknesses.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Suggestions & Keywords */}
            <div className="p-5 rounded-xl glass-panel space-y-4">
              
              {analysis.missingKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-purple-400" /> Recommended Keywords to Add
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-500/10 text-purple-400 font-semibold px-2 py-0.5 rounded border border-purple-500/10">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 border-t border-card-border pt-3">
                <h4 className="text-xs font-semibold text-foreground/80">Actionable Suggestions</h4>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {analysis.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-500">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Enhanced Answer */}
            {analysis.enhancedAnswer && (
              <div className="p-5 rounded-xl bg-teal-500/5 border border-teal-500/15 relative overflow-hidden space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-teal-400 font-heading flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" /> Enhanced Professional STAR Answer
                  </h4>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(analysis.enhancedAnswer)}
                      className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                      title="Copy Answer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSaveReport}
                      className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                      title="Save Report to Notes"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                      title="Download TXT Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs whitespace-pre-line text-muted-foreground leading-relaxed">
                  {analysis.enhancedAnswer}
                </p>
              </div>
            )}

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <Brain className="w-12 h-12 text-muted-foreground/45 mb-4 animate-bounce" />
            <h3 className="font-semibold text-sm">No analysis performed yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Draft your interview response in the left panel and click improve to test performance.</p>
          </div>
        )}

      </div>

    </div>
  );
}
