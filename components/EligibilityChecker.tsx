'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2,
  Bookmark,
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { checkEligibility } from '../lib/ai-engine';
import { EligibilityOutput } from '../types';

interface EligibilityCheckerProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function EligibilityChecker({ onAddActivity, onSaveNote, showToast }: EligibilityCheckerProps) {
  const [formData, setFormData] = useState({
    cgpa: '8.5',
    arrears: '0',
    skills: 'React, Next.js, Java, Python, SQL, Algorithms'
  });
  const [result, setResult] = useState<EligibilityOutput | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleCheck = () => {
    const cgpaNum = parseFloat(formData.cgpa);
    const arrearsNum = parseInt(formData.arrears);

    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      showToast('Please enter a valid CGPA (0.0 - 10.0).', 'error');
      return;
    }
    if (isNaN(arrearsNum) || arrearsNum < 0) {
      showToast('Please enter a valid number of active backlogs/arrears.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const eligibility = checkEligibility({
        cgpa: cgpaNum,
        arrears: arrearsNum,
        skills: formData.skills
      });
      setResult(eligibility);
      setIsPending(false);
      showToast('Eligibility calculated successfully!', 'success');
      onAddActivity(
        'Eligibility Evaluated', 
        `CGPA: ${cgpaNum} | Arrears: ${arrearsNum} - match score: ${eligibility.eligibilityPercentage}%`, 
        'eligibility'
      );
    }, 600);
  };

  const handleClear = () => {
    setFormData({ cgpa: '', arrears: '', skills: '' });
    setResult(null);
    showToast('Form cleared.', 'info');
  };

  const handleSaveReport = () => {
    if (!result) return;

    const noteContent = 
      `### Placement Eligibility Report\n\n` +
      `- **CGPA:** ${formData.cgpa}\n` +
      `- **Active Arrears:** ${formData.arrears}\n` +
      `- **Provided Skills:** ${formData.skills || 'None'}\n` +
      `- **Eligibility Match:** ${result.eligibilityPercentage}%\n\n` +
      `**Target Categorization:**\n` +
      `- Product-Based Drive Eligibility: ${result.eligibleCategories.productBased ? 'Yes ✅' : 'No ❌'}\n` +
      `- Service-Based Drive Eligibility: ${result.eligibleCategories.serviceBased ? 'Yes ✅' : 'No ❌'}\n` +
      `- Startup Drive Eligibility: ${result.eligibleCategories.startup ? 'Yes ✅' : 'No ❌'}\n\n` +
      `**Missing Requirements:**\n${result.missingRequirements.map(m => `• ${m}`).join('\n') || 'None'}\n\n` +
      `**Specific Recommendations:**\n${result.suggestions.map(s => `• ${s}`).join('\n')}`;

    onSaveNote(`Eligibility Scan (${result.eligibilityPercentage}%)`, noteContent, 'eligibility');
    showToast('Eligibility report saved to Export Center!', 'success');
  };

  const getScoreBadgeColor = (pct: number) => {
    if (pct < 50) return 'text-red-500 border-red-500/20 bg-red-500/5';
    if (pct < 80) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Placement Eligibility Checker</h2>
          <p className="text-xs text-muted-foreground">Verify your placement eligibility criteria against standard corporate guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Form Inputs */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-md font-bold font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" /> Academic Metrics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Cumulative CGPA (10.0 scale)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 7.85"
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Number of Active Arrears</label>
              <input
                type="number"
                min="0"
                value={formData.arrears}
                onChange={(e) => setFormData({ ...formData, arrears: e.target.value })}
                placeholder="e.g. 0"
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 font-sans">
            <label className="text-xs font-semibold text-foreground/80">List Core Technical/Soft Skills (comma separated)</label>
            <textarea
              rows={4}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. Java, Python, HTML/CSS, SQL, Algorithms, Leadership"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCheck}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking databases...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Calculate Eligibility
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border px-3 py-2.5 rounded-lg transition-all"
              title="Reset Form"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-400" />
            </button>
          </div>

        </div>

        {/* Output metrics */}
        {result ? (
          <div className="space-y-6">
            
            {/* Eligibility Percentage Banner */}
            <div className={`p-6 rounded-xl border flex items-center justify-between gap-6 transition-all ${getScoreBadgeColor(result.eligibilityPercentage)}`}>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Placement Eligibility</h4>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {result.eligibilityPercentage >= 80 
                    ? 'Excellent metrics! You meet criteria constraints for premium placement drives.'
                    : result.eligibilityPercentage >= 50
                    ? 'Average eligibility rating. Some tier-1 product companies might enforce stricter cut-offs.'
                    : 'High academic restrictions. Focus on clearing active backlogs/arrears immediately to qualify.'}
                </p>
              </div>
              <div className="text-center shrink-0">
                <h3 className="text-4xl font-bold font-heading">{result.eligibilityPercentage}%</h3>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Overall Match</span>
              </div>
            </div>

            {/* Target Category Matches */}
            <div className="p-5 rounded-xl glass-panel space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Target Category Match</h4>
              <div className="grid grid-cols-3 gap-3">
                
                <div className="p-3.5 rounded-lg bg-white/5 border border-card-border flex flex-col items-center justify-center text-center gap-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground">Service-Based</span>
                  {result.eligibleCategories.serviceBased ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">✅ Eligible</span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">❌ Ineligible</span>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-card-border flex flex-col items-center justify-center text-center gap-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground">Product-Based</span>
                  {result.eligibleCategories.productBased ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">✅ Eligible</span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">❌ Ineligible</span>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-card-border flex flex-col items-center justify-center text-center gap-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground">Startups</span>
                  {result.eligibleCategories.startup ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">✅ Eligible</span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">❌ Ineligible</span>
                  )}
                </div>

              </div>
            </div>

            {/* Alerts & Missing parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Missing constraints */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Academic Red-Flags
                </h4>
                {result.missingRequirements.length > 0 ? (
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    {result.missingRequirements.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Zero red-flags found!
                  </p>
                )}
              </div>

              {/* Suggestions */}
              <div className="p-5 rounded-xl glass-panel space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Specific Advice
                </h4>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {result.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Save Analysis */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleSaveReport}
                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-foreground border border-card-border font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
              >
                <Bookmark className="w-4 h-4" /> Save Eligibility Report
              </button>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <Award className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
            <h3 className="font-semibold text-sm">No analysis performed yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Input your educational details on the left to verify your eligibility.</p>
          </div>
        )}

      </div>

    </div>
  );
}
