'use client';

import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  Briefcase, 
  Video, 
  Award, 
  ListTodo, 
  CreditCard,
  Plus,
  ArrowRight
} from 'lucide-react';
import { ActivityLog } from '../types';

interface DashboardProps {
  stats: {
    totalAnalyses: number;
    savedReportsCount: number;
    activityCount: number;
    leetcodeCompletionPct: number;
  };
  recentActivity: ActivityLog[];
  onNavigate: (tab: string) => void;
  onClearActivities: () => void;
}

export default function Dashboard({ stats, recentActivity, onNavigate, onClearActivities }: DashboardProps) {
  
  const quickActions = [
    { name: 'Scan Resume', tab: 'resume', desc: 'Scan Resume against ATS constraints', color: 'from-cyan-500 to-emerald-500', icon: FileText },
    { name: 'Optimize Answer', tab: 'interview', desc: 'Polish behavioral responses', color: 'from-purple-500 to-indigo-500', icon: Video },
    { name: 'Cover Letter', tab: 'cover-letter', desc: 'Generate target cover letters', color: 'from-pink-500 to-rose-500', icon: Briefcase },
    { name: 'Study Planner', tab: 'leetcode', desc: '30-Day LeetCode study calendar', color: 'from-amber-500 to-orange-500', icon: ListTodo },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-indigo-500/10 p-8 glass-panel border border-brand-500/15">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-2 font-heading">
            Forge Your Career Path with AI
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Welcome to CareerForge AI! Use our free client-side suite to optimize your resume, prepare for interviews, build technical roadmaps, check placement eligibility, and split study expenses.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('resume')} 
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all duration-200"
            >
              Start Resume Scan <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('settings')} 
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground border border-card-border font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all"
            >
              Configure Profile
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <TrendingUp className="w-full h-full text-teal-400 p-8" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Analyses</span>
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-500"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">{stats.totalAnalyses}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Processed client-side</p>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saved Reports</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><FileText className="w-4 h-4" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">{stats.savedReportsCount}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Available in Export Center</p>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Study Progress</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><ListTodo className="w-4 h-4" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">{stats.leetcodeCompletionPct}%</h3>
            <p className="text-[11px] text-muted-foreground mt-1">LeetCode tasks finished</p>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Events</span>
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Award className="w-4 h-4" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">{stats.activityCount}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Logged session events</p>
          </div>
        </div>

      </div>

      {/* Quick Launch & Activity Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Launch Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-500" /> Quick Launch Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => onNavigate(action.tab)}
                className="group relative overflow-hidden text-left p-5 rounded-xl glass-card border border-card-border hover:border-brand-500/30 flex items-start gap-4 transition-all"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-md transition-all group-hover:scale-105`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm group-hover:text-teal-400 transition-colors">{action.name}</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading">Recent Session Activity</h3>
            {recentActivity.length > 0 && (
              <button 
                onClick={onClearActivities}
                className="text-[10px] text-red-500 hover:text-red-400 transition-all font-semibold uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="rounded-xl glass-panel p-4 max-h-[300px] overflow-y-auto space-y-3">
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-muted-foreground">No recent activity logged yet.</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Start using tools to log events!</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="text-xs border-b border-card-border last:border-0 pb-2.5 last:pb-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground/90">{activity.title}</span>
                    <span className="text-[9px] text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{activity.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
