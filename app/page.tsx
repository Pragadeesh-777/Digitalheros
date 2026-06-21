'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Video, 
  FileText, 
  Share2, 
  Map, 
  Award, 
  ListTodo, 
  CreditCard, 
  Bookmark, 
  Settings as SettingsIcon,
  Search,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Keyboard,
  Info,
  CheckCircle2
} from 'lucide-react';

// Subcomponents
import Dashboard from '../components/Dashboard';
import InterviewImprover from '../components/InterviewImprover';
import ResumeScanner from '../components/ResumeScanner';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import LinkedInGenerator from '../components/LinkedInGenerator';
import RoadmapGenerator from '../components/RoadmapGenerator';
import EligibilityChecker from '../components/EligibilityChecker';
import LeetCodePlanner from '../components/LeetCodePlanner';
import ExpenseSplitter from '../components/ExpenseSplitter';
import NotesExport from '../components/NotesExport';
import Settings from '../components/Settings';

// Types & Helpers
import { ActivityLog, SavedNote } from '../types';
import { generateId, formatDate } from '../lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Data State
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
  const [leetcodeCompletionPct, setLeetcodeCompletionPct] = useState<number>(0);
  
  // Toast State
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'error' }[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ title: string; category: string; tab: string; id?: string }[]>([]);
  const [searchFocus, setSearchFocus] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize and load from local storage
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('careerforge_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }

    // Sidebar
    const savedSidebar = localStorage.getItem('careerforge_sidebar_collapsed');
    if (savedSidebar) {
      setSidebarCollapsed(JSON.parse(savedSidebar));
    }

    // Notes
    const savedNotes = localStorage.getItem('careerforge_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    // Activity Logs
    const savedActivity = localStorage.getItem('careerforge_activity');
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    }

    // Stats
    const savedAnalyses = localStorage.getItem('careerforge_total_analyses');
    if (savedAnalyses) {
      setTotalAnalyses(Number(savedAnalyses));
    }
  }, []);

  // Keyboard Shortcuts (Ctrl+K to search, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchFocus(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply theme to HTML tag
  const applyTheme = (t: 'light' | 'dark') => {
    const root = window.document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('careerforge_theme', newTheme);
    showToast(`Switched to ${newTheme} mode!`, 'info');
  };

  const handleToggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('careerforge_sidebar_collapsed', JSON.stringify(newCollapsed));
  };

  // Toast notifier helper
  const showToast = (msg: string, type: 'success' | 'info' | 'error') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Activity Logger
  const handleAddActivity = (title: string, description: string, type: any) => {
    const newLog: ActivityLog = {
      id: generateId(),
      type,
      title,
      description,
      timestamp: formatDate(new Date().toISOString())
    };
    const updated = [newLog, ...recentActivity].slice(0, 30); // Cap at 30 items
    setRecentActivity(updated);
    localStorage.setItem('careerforge_activity', JSON.stringify(updated));
    
    // Increment analyses count if relevant tool activity logged
    if (['interview', 'resume', 'roadmap', 'eligibility'].includes(type)) {
      const nextAnalyses = totalAnalyses + 1;
      setTotalAnalyses(nextAnalyses);
      localStorage.setItem('careerforge_total_analyses', String(nextAnalyses));
    }
  };

  const handleClearActivities = () => {
    setRecentActivity([]);
    localStorage.removeItem('careerforge_activity');
    showToast('Activity logs cleared.', 'info');
  };

  // Notes/Reports Database Actions
  const handleAddNote = (title: string, content: string, category: any) => {
    const newNote: SavedNote = {
      id: generateId(),
      title,
      content,
      category,
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('careerforge_notes', JSON.stringify(updated));
    handleAddActivity('Report Saved', `Saved "${title}" report to Export Center`, category);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('careerforge_notes', JSON.stringify(updated));
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    const updated = notes.map(n => {
      if (n.id === id) {
        return { ...n, title, content };
      }
      return n;
    });
    setNotes(updated);
    localStorage.setItem('careerforge_notes', JSON.stringify(updated));
  };

  const handleClearStorage = () => {
    localStorage.clear();
    setNotes([]);
    setRecentActivity([]);
    setTotalAnalyses(0);
    setLeetcodeCompletionPct(0);
    showToast('Application database cleared.', 'success');
  };

  const handleResetApp = () => {
    localStorage.clear();
    setNotes([]);
    setRecentActivity([]);
    setTotalAnalyses(0);
    setLeetcodeCompletionPct(0);
    setTheme('dark');
    applyTheme('dark');
    setActiveTab('dashboard');
    showToast('Application reset to defaults.', 'success');
  };

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchQuery.toLowerCase();
    const results: { title: string; category: string; tab: string; id?: string }[] = [];

    // Search pages
    const pages = [
      { title: 'Dashboard', category: 'Navigation', tab: 'dashboard' },
      { title: 'Interview Answer Improver', category: 'Tool', tab: 'interview' },
      { title: 'Resume ATS Scanner', category: 'Tool', tab: 'resume' },
      { title: 'Cover Letter Generator', category: 'Tool', tab: 'cover-letter' },
      { title: 'LinkedIn Post Generator', category: 'Tool', tab: 'linkedin' },
      { title: 'Placement Roadmap Generator', category: 'Tool', tab: 'roadmap' },
      { title: 'Placement Eligibility Checker', category: 'Tool', tab: 'eligibility' },
      { title: 'LeetCode Study Planner', category: 'Tool', tab: 'leetcode' },
      { title: 'Placement Expense Splitter', category: 'Tool', tab: 'expense' },
      { title: 'Notes & Export Center', category: 'Navigation', tab: 'notes-export' },
      { title: 'Settings & Profile', category: 'Navigation', tab: 'settings' }
    ];

    pages.forEach(p => {
      if (p.title.toLowerCase().includes(term)) {
        results.push(p);
      }
    });

    // Search Notes
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term)) {
        results.push({
          title: note.title,
          category: `Saved ${note.category.toUpperCase()}`,
          tab: 'notes-export',
          id: note.id
        });
      }
    });

    setSearchResults(results.slice(0, 6));
  }, [searchQuery, notes]);

  const handleSearchResultClick = (res: { tab: string; id?: string }) => {
    setActiveTab(res.tab);
    setSearchQuery('');
    setSearchFocus(false);
    showToast(`Navigated to ${res.tab.toUpperCase()}`, 'info');
  };

  // Navigation Items Definitions
  const navigationItems = [
    { name: 'Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { name: 'Interview Improver', tab: 'interview', icon: Video },
    { name: 'Resume ATS Scanner', tab: 'resume', icon: FileText },
    { name: 'Cover Letter Gen', tab: 'cover-letter', icon: Briefcase },
    { name: 'LinkedIn Post Gen', tab: 'linkedin', icon: Share2 },
    { name: 'Placement Roadmap', tab: 'roadmap', icon: Map },
    { name: 'Eligibility Checker', tab: 'eligibility', icon: Award },
    { name: 'LeetCode Planner', tab: 'leetcode', icon: ListTodo },
    { name: 'Expense Splitter', tab: 'expense', icon: CreditCard },
    { name: 'Notes Export', tab: 'notes-export', icon: Bookmark },
    { name: 'Settings & Info', tab: 'settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background Decorative Blurs */}
      <div className="bg-glow top-[-200px] right-[-100px] bg-teal-500/10 dark:bg-teal-500/20" />
      <div className="bg-glow bottom-[-100px] left-[-200px] bg-purple-500/10 dark:bg-purple-500/20" />

      {/* Main Layout Container */}
      <div className="flex-1 flex items-stretch">
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside 
          className={`hidden lg:flex flex-col border-r border-card-border bg-sidebar-bg/60 backdrop-blur-xl transition-all duration-300 z-50 shrink-0 select-none ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-card-border">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 scale-90 w-0' : 'opacity-100 scale-100 w-auto'}`}>
              <div className="p-2 rounded bg-gradient-to-br from-teal-500 to-purple-500 text-white shadow shadow-teal-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight font-heading bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">CareerForge AI</span>
                <span className="block text-[8px] text-muted-foreground uppercase font-bold tracking-widest leading-none">local workspace</span>
              </div>
            </div>
            <button
              onClick={handleToggleSidebar}
              className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav list */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-105'}`} />
                  <span className={`truncate transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-auto'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* HEADER BAR */}
          <header className="h-16 border-b border-card-border bg-background/50 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between gap-4">
            
            {/* Left Header items */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="lg:hidden flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-500" />
                <span className="font-extrabold text-xs tracking-tight font-heading">CareerForge AI</span>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="relative max-w-sm w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  placeholder="Search tools or notes... (Ctrl+K)"
                  className="w-full bg-input-bg border border-card-border rounded-lg pl-9 pr-9 py-1.5 text-xs outline-none focus:border-teal-500 transition-all font-sans"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground border border-card-border px-1.5 py-0.5 rounded font-mono font-bold pointer-events-none bg-white/5">
                  /
                </span>
              </div>

              {/* Search dropdown results */}
              {searchFocus && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-sidebar-bg/95 backdrop-blur-xl border border-card-border rounded-xl shadow-xl p-2.5 z-50 space-y-1 animate-slide-down">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchResultClick(res)}
                      className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-muted-foreground hover:text-foreground transition-all"
                    >
                      <span className="font-semibold truncate pr-4">{res.title}</span>
                      <span className="text-[9px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">{res.category}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchFocus && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-sidebar-bg/95 backdrop-blur-xl border border-card-border rounded-xl shadow-xl p-4 text-center text-xs text-muted-foreground z-50">
                  No matching tools or reports found.
                </div>
              )}
            </div>

            {/* Right Header items */}
            <div className="flex items-center gap-2.5 select-none">
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              
              <a 
                href="https://digitalheroesco.com" 
                target="_blank" 
                className="hidden sm:inline-flex items-center gap-1.5 bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/10 font-bold text-[10px] px-3 py-1.5 rounded-full transition-all uppercase tracking-wider"
              >
                <span>Built for Digital Heroes</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </header>

          {/* MAIN PAGE ROUTING PREVIEWS */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
            
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={{
                  totalAnalyses,
                  savedReportsCount: notes.length,
                  activityCount: recentActivity.length,
                  leetcodeCompletionPct
                }}
                recentActivity={recentActivity}
                onNavigate={(tab) => setActiveTab(tab)}
                onClearActivities={handleClearActivities}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewImprover
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeScanner
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'cover-letter' && (
              <CoverLetterGenerator
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'linkedin' && (
              <LinkedInGenerator
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapGenerator
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'eligibility' && (
              <EligibilityChecker
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'leetcode' && (
              <LeetCodePlanner
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
                onUpdateStudyProgress={(pct) => setLeetcodeCompletionPct(pct)}
              />
            )}

            {activeTab === 'expense' && (
              <ExpenseSplitter
                onAddActivity={handleAddActivity}
                onSaveNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'notes-export' && (
              <NotesExport
                notes={notes}
                onDeleteNote={handleDeleteNote}
                onUpdateNote={handleUpdateNote}
                onAddNote={handleAddNote}
                showToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onClearStorage={handleClearStorage}
                onResetApp={handleResetApp}
                showToast={showToast}
              />
            )}

          </main>

          {/* STICKY FOOTER (Mandatory specs) */}
          <footer className="border-t border-card-border bg-background/70 backdrop-blur-md py-4 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 select-none shrink-0 z-30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[10px] text-muted-foreground">
              <span>Full Name: <strong className="text-foreground">PRAGADEESHWARAN R</strong></span>
              <span className="hidden sm:inline text-card-border">|</span>
              <span>Email: <a href="mailto:2k23it37@kiot.ac.in" className="text-teal-500 hover:underline">2k23it37@kiot.ac.in</a></span>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="https://digitalheroesco.com" 
                target="_blank" 
                className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white font-extrabold text-[10px] px-4 py-2 rounded-lg shadow-md hover:shadow-teal-500/10 transition-all uppercase tracking-wider"
              >
                <span>Built for Digital Heroes</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </footer>

        </div>

      </div>

      {/* MOBILE COLLAPSIBLE SIDEBAR MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in flex">
          <aside className="w-64 max-w-xs bg-sidebar-bg border-r border-card-border flex flex-col animate-slide-right p-4 space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-card-border">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-500" />
                <span className="font-extrabold text-xs tracking-tight font-heading">CareerForge AI</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-teal-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-card-border text-[9px] text-muted-foreground space-y-1">
              <p>PRAGADEESHWARAN R</p>
              <p>2k23it37@kiot.ac.in</p>
            </div>
          </aside>
          
          {/* Overlay Click-to-close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* FLOATING TOASTS Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none select-none max-w-xs w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3 rounded-lg shadow-lg border text-xs font-semibold animate-slide-down flex items-start gap-2 backdrop-blur-md pointer-events-auto ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
