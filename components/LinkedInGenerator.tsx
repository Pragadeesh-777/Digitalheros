'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Trash2,
  Bookmark,
  Share2,
  Grid
} from 'lucide-react';
import { generateLinkedInPost } from '../lib/ai-engine';
import { LinkedInOutputs } from '../types';

interface LinkedInGeneratorProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function LinkedInGenerator({ onAddActivity, onSaveNote, showToast }: LinkedInGeneratorProps) {
  const [formData, setFormData] = useState({
    projectName: 'CareerForge AI',
    skillsUsed: 'Next.js 15, TypeScript, Tailwind CSS, LocalStorage, React 19',
    problemSolved: 'Helped job seekers practice behavioral interviews using STAR metrics, verify resume ATS compliance scores, generate tailored cover letters, and track DSA code paths completely free in the browser with zero backend data storage.'
  });
  const [outputs, setOutputs] = useState<LinkedInOutputs | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'emoji' | 'short' | 'long'>('emoji');

  const handleGenerate = () => {
    if (!formData.projectName.trim() || !formData.skillsUsed.trim() || !formData.problemSolved.trim()) {
      showToast('Please fill out all input fields.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const result = generateLinkedInPost(formData);
      setOutputs(result);
      setIsPending(false);
      showToast('LinkedIn posts compiled!', 'success');
      onAddActivity(
        'LinkedIn Post Generated', 
        `Created posts for project "${formData.projectName}"`, 
        'linkedin'
      );
    }, 700);
  };

  const handleClear = () => {
    setFormData({ projectName: '', skillsUsed: '', problemSolved: '' });
    setOutputs(null);
    showToast('Form cleared.', 'info');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Post copied to clipboard!', 'success');
  };

  const handleSaveNote = (title: string, text: string) => {
    onSaveNote(`LinkedIn Post: ${title}`, text, 'linkedin');
    showToast('Post draft saved to Export Center!', 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getActiveText = () => {
    if (!outputs) return '';
    if (activeTab === 'emoji') return outputs.emojiRich;
    if (activeTab === 'short') return outputs.shortVersion;
    return outputs.longVersion;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <Share2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">LinkedIn Post Generator</h2>
          <p className="text-xs text-muted-foreground">Draft high-reach professional social posts highlighting your achievements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Form panel */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-md font-bold font-heading flex items-center gap-2">
            <Grid className="w-4 h-4 text-teal-500" /> Project Details
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Project / Portfolio Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="e.g. CareerForge AI"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Technologies & Skills Used</label>
            <input
              type="text"
              name="skillsUsed"
              value={formData.skillsUsed}
              onChange={handleInputChange}
              placeholder="e.g. Next.js, TypeScript, Tailwind CSS, LocalStorage"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Problem Solved (Core Value Proposition)</label>
            <textarea
              name="problemSolved"
              rows={4}
              value={formData.problemSolved}
              onChange={handleInputChange}
              placeholder="e.g. helped job seekers optimize resumes and practice interview replies completely free offline without storing sensitive CV data on servers"
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
                  Compiling drafts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Post
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

        {/* Output Panel */}
        {outputs ? (
          <div className="space-y-4">
            
            {/* Nav tabs for layouts */}
            <div className="flex bg-white/5 dark:bg-white/5 border border-card-border rounded-lg p-1">
              <button
                onClick={() => setActiveTab('emoji')}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'emoji' ? 'bg-teal-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Emoji-Rich
              </button>
              <button
                onClick={() => setActiveTab('short')}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'short' ? 'bg-teal-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Short Version
              </button>
              <button
                onClick={() => setActiveTab('long')}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'long' ? 'bg-teal-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Long Story
              </button>
            </div>

            {/* Content Output */}
            <div className="p-6 rounded-xl glass-panel relative border border-card-border space-y-4">
              <textarea
                value={getActiveText()}
                readOnly
                rows={12}
                className="w-full bg-transparent border-0 outline-none text-xs leading-relaxed text-muted-foreground resize-none focus:ring-0"
              />
              
              {/* Actions row */}
              <div className="flex gap-2 pt-4 border-t border-card-border">
                <button
                  onClick={() => handleCopy(getActiveText())}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 font-semibold text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Draft
                </button>
                <button
                  onClick={() => handleSaveNote(`${formData.projectName} (${activeTab})`, getActiveText())}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save Draft
                </button>
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border text-xs px-3 py-2 rounded-lg transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <Share2 className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
            <h3 className="font-semibold text-sm">No post draft compiled</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Draft your project profile details in the left settings to build search-optimized LinkedIn articles.</p>
          </div>
        )}

      </div>

    </div>
  );
}
