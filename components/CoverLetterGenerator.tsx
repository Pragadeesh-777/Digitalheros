'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Trash2,
  Bookmark,
  Briefcase,
  FileText
} from 'lucide-react';
import { generateCoverLetter } from '../lib/ai-engine';

interface CoverLetterGeneratorProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function CoverLetterGenerator({ onAddActivity, onSaveNote, showToast }: CoverLetterGeneratorProps) {
  const [formData, setFormData] = useState({
    name: 'Pragadeeshwaran R',
    companyName: 'Digital Heroes',
    role: 'Software Developer Intern',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, LocalStorage',
    experience: 'Created a comprehensive Career Toolkit web application using React and Next.js, optimizing the bundle size and rendering layout'
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleGenerate = () => {
    if (!formData.name.trim() || !formData.companyName.trim() || !formData.role.trim()) {
      showToast('Please fill out Name, Company, and Role fields.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const letter = generateCoverLetter(formData);
      setGeneratedLetter(letter);
      setIsPending(false);
      showToast('Cover letter generated!', 'success');
      onAddActivity(
        'Cover Letter Generated', 
        `Created cover letter for ${formData.role} position at ${formData.companyName}`, 
        'cover-letter'
      );
    }, 600);
  };

  const handleClear = () => {
    setFormData({ name: '', companyName: '', role: '', skills: '', experience: '' });
    setGeneratedLetter('');
    showToast('Form cleared.', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    showToast('Cover letter copied!', 'success');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cover_letter_${formData.companyName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded cover letter successfully!', 'success');
  };

  const handleSaveNote = () => {
    onSaveNote(`Cover Letter: ${formData.companyName} (${formData.role})`, generatedLetter, 'cover-letter');
    showToast('Cover letter saved to Export Center!', 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Cover Letter Generator</h2>
          <p className="text-xs text-muted-foreground">Draft customized, highly tailored professional cover letters for job applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Input Details */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-md font-bold font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-500" /> Letter Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Jane Doe"
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Target Company</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g. Google"
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Job Title / Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g. Junior Frontend Developer"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Key Technical Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g. React, Next.js, TypeScript, REST APIs"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Relevant Experience Summary</label>
            <textarea
              name="experience"
              rows={4}
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g. 2 years of developing responsive web apps, collaborating in small agile teams, and improving site core web vitals"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Cover Letter
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

        {/* Output Letter Panel */}
        {generatedLetter ? (
          <div className="space-y-4">
            
            <div className="p-6 rounded-xl glass-panel relative border border-card-border space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-card-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formal Cover Letter Draft</span>
                <span className="text-[10px] text-muted-foreground">{generatedLetter.length} characters</span>
              </div>
              
              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                rows={16}
                className="w-full bg-transparent border-0 outline-none text-xs font-mono leading-relaxed text-muted-foreground resize-none focus:ring-0 focus:text-foreground transition-all"
              />

              {/* Actions row */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-card-border">
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Letter
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save Letter
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download TXT
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <FileText className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
            <h3 className="font-semibold text-sm">No cover letter generated</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Provide target job specs in the left inputs to build a customized application letter.</p>
          </div>
        )}

      </div>

    </div>
  );
}
