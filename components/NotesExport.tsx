'use client';

import React, { useState } from 'react';
import { 
  Trash2,
  Bookmark,
  Plus,
  Search,
  Download,
  Copy,
  Printer,
  Edit,
  Save,
  X,
  FileText
} from 'lucide-react';
import { SavedNote } from '../types';

interface NotesExportProps {
  notes: SavedNote[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onAddNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function NotesExport({ notes, onDeleteNote, onUpdateNote, onAddNote, showToast }: NotesExportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Edit note state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Add custom note state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'general' | 'interview' | 'resume'>('general');

  const categories = [
    { value: 'all', label: 'All Saved Notes' },
    { value: 'interview', label: 'Interview Answers' },
    { value: 'resume', label: 'Resume Reports' },
    { value: 'cover-letter', label: 'Cover Letters' },
    { value: 'linkedin', label: 'LinkedIn Drafts' },
    { value: 'roadmap', label: 'Career Roadmaps' },
    { value: 'eligibility', label: 'Eligibility Scans' },
    { value: 'leetcode', label: 'LeetCode Plans' },
    { value: 'expense', label: 'Expense Splits' },
    { value: 'general', label: 'General Notes' },
  ];

  const handleStartEdit = (note: SavedNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      showToast('Title and Content cannot be empty.', 'error');
      return;
    }
    if (editingId) {
      onUpdateNote(editingId, editTitle, editContent);
      setEditingId(null);
      showToast('Note updated.', 'success');
    }
  };

  const handleCreateNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Title and Content are required.', 'error');
      return;
    }
    onAddNote(newTitle, newContent, newCategory);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
    showToast('Custom note saved.', 'success');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied note to clipboard!', 'success');
  };

  const handleDownloadNote = (note: SavedNote) => {
    const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Note downloaded.', 'success');
  };

  const handlePrint = (note: SavedNote) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1a202c; line-height: 1.6; }
            h1 { font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            pre { font-family: inherit; font-size: 14px; white-space: pre-wrap; margin-top: 20px; }
            .meta { font-size: 12px; color: #718096; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="meta">Category: ${note.category.toUpperCase()} | Exported from CareerForge AI</div>
          <pre>${note.content}</pre>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading">Notes & Export Center</h2>
            <p className="text-xs text-muted-foreground">Manage and export all saved summaries, templates, and evaluation reports.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg transition-all"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? 'Cancel' : 'New Note'}</span>
        </button>
      </div>

      {/* Add Custom Note Form */}
      {showAddForm && (
        <div className="p-6 rounded-xl glass-panel border border-card-border space-y-4 animate-slide-down max-w-xl">
          <h3 className="text-sm font-bold font-heading">Create Custom Note</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Behavioral Notes"
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2 text-xs outline-none focus:border-teal-500 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Category</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2 text-xs outline-none focus:border-teal-500 transition-all cursor-pointer appearance-none bg-background"
              >
                <option value="general">General</option>
                <option value="interview">Interview Answer</option>
                <option value="resume">Resume ATS Report</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Note Contents</label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Type your notes here..."
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2 text-xs outline-none focus:border-teal-500 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleCreateNote}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all"
          >
            Save Note
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category List */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-full border transition-all ${selectedCategory === cat.value ? 'bg-teal-600 border-teal-600 text-white shadow' : 'bg-white/5 border-card-border text-muted-foreground hover:text-foreground'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-white/5 border border-card-border rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-teal-500 transition-all"
          />
        </div>

      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const isEditing = editingId === note.id;
            return (
              <div 
                key={note.id} 
                className="p-5 rounded-xl glass-panel border border-card-border space-y-4 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 border-b border-card-border pb-2.5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-white/5 border border-card-border rounded-md px-2 py-0.5 text-xs font-semibold outline-none focus:border-teal-500 w-2/3"
                      />
                    ) : (
                      <h4 className="font-bold text-xs sm:text-sm text-foreground/95">{note.title}</h4>
                    )}
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full border bg-teal-500/10 text-teal-400 border-teal-500/10 uppercase tracking-wider">
                      {note.category}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground block pt-1">Saved: {new Date(note.createdAt).toLocaleString()}</span>
                </div>

                {/* Content body */}
                <div className="flex-1">
                  {isEditing ? (
                    <textarea
                      rows={6}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white/5 border border-card-border rounded-md p-2 text-xs font-mono outline-none focus:border-teal-500 resize-none leading-relaxed text-muted-foreground"
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                      {note.content}
                    </p>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between border-t border-card-border/60 pt-3 mt-2">
                  <div className="flex gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 transition-all"
                          title="Save Changes"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-all"
                          title="Cancel Edit"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          title="Edit Note"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(note.content)}
                          className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          title="Copy Note Text"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadNote(note)}
                          className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          title="Download Text File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handlePrint(note)}
                          className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          title="Export PDF / Print"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onDeleteNote(note.id);
                      showToast('Note deleted.', 'info');
                    }}
                    className="p-1.5 rounded bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-all"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
          <FileText className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
          <h3 className="font-semibold text-sm">No notes match query</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Save reports or write custom notes to display them in this workspace.</p>
        </div>
      )}

    </div>
  );
}
