'use client';

import React from 'react';
import { 
  Trash2,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Info,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Mail,
  User
} from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onClearStorage: () => void;
  onResetApp: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Settings({ theme, onToggleTheme, onClearStorage, onResetApp, showToast }: SettingsProps) {
  
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all saved reports and plans? This action is permanent.')) {
      onClearStorage();
      showToast('All saved local reports cleared.', 'success');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all app settings and notes back to defaults?')) {
      onResetApp();
      showToast('CareerForge AI has been reset to defaults.', 'success');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Settings & Info</h2>
          <p className="text-xs text-muted-foreground">Adjust application parameters, clear storage space, or review documentation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Configurations panel */}
        <div className="space-y-6">
          
          {/* General options */}
          <div className="p-5 rounded-xl glass-panel space-y-4">
            <h3 className="text-sm font-bold font-heading border-b border-card-border pb-2 flex items-center gap-2">
              <Sun className="w-4 h-4 text-teal-500" /> Interface Customization
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground/90">Display Theme Mode</span>
                <p className="text-[10px] text-muted-foreground">Switch between light and dark backgrounds</p>
              </div>
              
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-lg bg-white/5 border border-card-border text-teal-400 hover:text-teal-300 transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Database maintenance options */}
          <div className="p-5 rounded-xl glass-panel space-y-4">
            <h3 className="text-sm font-bold font-heading border-b border-card-border pb-2 flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-4 h-4" /> Danger Zone
            </h3>

            <div className="flex items-center justify-between gap-4 border-b border-card-border/60 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground/90">Clear Local Storage</span>
                <p className="text-[10px] text-muted-foreground">Deletes all saved analysis outputs and study templates</p>
              </div>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 text-xs px-2.5 py-1.5 rounded-lg transition-all font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Data
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground/90">Reset Application</span>
                <p className="text-[10px] text-muted-foreground">Restores the app back to factory clean defaults</p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/15 text-xs px-2.5 py-1.5 rounded-lg transition-all font-semibold"
              >
                Reset App
              </button>
            </div>
          </div>

        </div>

        {/* Info panel */}
        <div className="space-y-6">
          
          {/* About Section */}
          <div className="p-5 rounded-xl glass-panel space-y-3 font-sans">
            <h3 className="text-sm font-bold font-heading border-b border-card-border pb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-500" /> About CareerForge AI
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CareerForge AI is an all-in-one offline browser toolkit designed to assist students and placement candidates in prepping for coding and behavioral evaluations.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All tools run 100% locally in your browser sandbox using rule-based parsing algorithms. No data is sent to external cloud APIs or servers, ensuring complete file security.
            </p>
          </div>

          {/* Developer Badge */}
          <div className="p-5 rounded-xl bg-teal-500/5 border border-teal-500/15 space-y-4">
            <h3 className="text-sm font-bold text-teal-400 font-heading">Candidate Contact Card</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <User className="w-4 h-4 text-teal-400" />
                <span>Full Name: <strong className="text-foreground">PRAGADEESHWARAN R</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>Email: <a href="mailto:2k23it37@kiot.ac.in" className="text-teal-400 hover:underline">2k23it37@kiot.ac.in</a></span>
              </div>
            </div>

            <div className="pt-2 border-t border-teal-500/15">
              <a 
                href="https://digitalheroesco.com" 
                target="_blank" 
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-all"
              >
                <span>Built for Digital Heroes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
