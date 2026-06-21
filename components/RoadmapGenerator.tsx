'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2,
  Bookmark,
  Calendar,
  CheckCircle2, 
  Map,
  Clock,
  BookOpen
} from 'lucide-react';
import { generateRoadmap } from '../lib/ai-engine';
import { RoadmapOutput } from '../types';

interface RoadmapGeneratorProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function RoadmapGenerator({ onAddActivity, onSaveNote, showToast }: RoadmapGeneratorProps) {
  const [formData, setFormData] = useState({
    branch: 'Computer Science',
    targetRole: 'Frontend Developer',
    availableHours: 15
  });
  const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [isPending, setIsPending] = useState(false);

  // Restore checked checklist items from local storage if roadmap changes
  useEffect(() => {
    if (roadmap) {
      const saved = localStorage.getItem(`roadmap_checklist_${roadmap.title.replace(/\s+/g, '_')}`);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    }
  }, [roadmap]);

  const handleGenerate = () => {
    if (!formData.targetRole.trim()) {
      showToast('Please specify your Target Role.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const result = generateRoadmap(formData);
      setRoadmap(result);
      setIsPending(false);
      showToast('Roadmap generated successfully!', 'success');
      onAddActivity(
        'Roadmap Compiled', 
        `Built study plan for "${formData.targetRole}" - target duration calculated based on ${formData.availableHours} hrs/wk`, 
        'roadmap'
      );
    }, 700);
  };

  const handleClear = () => {
    setFormData({ branch: 'Computer Science', targetRole: '', availableHours: 15 });
    setRoadmap(null);
    setCheckedItems({});
    showToast('Form cleared.', 'info');
  };

  const handleCheckChange = (phaseIdx: number, itemIdx: number, val: boolean) => {
    if (!roadmap) return;
    const key = `${phaseIdx}-${itemIdx}`;
    const updated = {
      ...checkedItems,
      [key]: val
    };
    setCheckedItems(updated);
    localStorage.setItem(
      `roadmap_checklist_${roadmap.title.replace(/\s+/g, '_')}`, 
      JSON.stringify(updated)
    );
  };

  const handleSaveNote = () => {
    if (!roadmap) return;
    
    let noteContent = `### ${roadmap.title}\n\n`;
    roadmap.phases.forEach((phase, pIdx) => {
      noteContent += `#### ${phase.title} (${phase.duration})\n`;
      noteContent += `*Description:* ${phase.description}\n\n`;
      noteContent += `*Key Topics:* ${phase.topics.join(', ')}\n\n`;
      noteContent += `*Action Items:*\n`;
      phase.actionItems.forEach((action, aIdx) => {
        const isChecked = checkedItems[`${pIdx}-${aIdx}`] ? ' [x] ' : ' [ ] ';
        noteContent += `-${isChecked}${action}\n`;
      });
      noteContent += `\n`;
    });

    onSaveNote(`Roadmap: ${formData.targetRole}`, noteContent, 'roadmap');
    showToast('Roadmap saved to Export Center!', 'success');
  };

  const branches = [
    'Computer Science', 'Information Technology', 'Electronics & Communication', 
    'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'Other'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <Map className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Placement Roadmap Generator</h2>
          <p className="text-xs text-muted-foreground">Map your educational branch and available weekly workload to concrete phase milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Form Details */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-sm font-bold font-heading flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500" /> Roadmap Preferences
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Academic Branch</label>
            <div className="relative">
              <select
                name="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-xs outline-none focus:border-teal-500 transition-all cursor-pointer appearance-none"
              >
                {branches.map((b, idx) => (
                  <option key={idx} value={b} className="bg-background">{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Target Role</label>
            <input
              type="text"
              name="targetRole"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              placeholder="e.g. Frontend React Engineer"
              className="w-full bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 py-2.5 text-xs outline-none focus:border-teal-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-foreground/80">
              <span>Available Preparation Workload</span>
              <span className="text-teal-500 font-bold">{formData.availableHours} hours / week</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={formData.availableHours}
              onChange={(e) => setFormData({ ...formData, availableHours: Number(e.target.value) })}
              className="w-full cursor-ew-resize"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Part-Time (5h)</span>
              <span>Standard (15h)</span>
              <span>Intensive (40h)</span>
            </div>
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
                  Mapping Phases...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Compile Roadmap
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

        {/* Roadmap Output */}
        <div className="xl:col-span-2">
          {roadmap ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between px-1">
                <h3 className="text-md font-bold font-heading text-teal-400">{roadmap.title}</h3>
                <button
                  onClick={handleSaveNote}
                  className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-foreground border border-card-border text-xs px-2.5 py-1.5 rounded-lg transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save Plan
                </button>
              </div>

              {/* Phases Timeline */}
              <div className="relative border-l border-card-border ml-3 pl-6 space-y-6">
                
                {roadmap.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="relative group">
                    
                    {/* Circle bullet on timeline */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    </div>

                    <div className="p-5 rounded-xl glass-panel space-y-4">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-2.5">
                        <h4 className="font-bold text-sm text-foreground/95">{phase.title}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-semibold border border-teal-500/10">
                          <Clock className="w-3 h-3" /> {phase.duration}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">{phase.description}</p>

                      {/* Topics */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Core Topics</span>
                        <div className="flex flex-wrap gap-1">
                          {phase.topics.map((t, tIdx) => (
                            <span key={tIdx} className="text-[9px] bg-white/5 border border-card-border text-muted-foreground px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 border-t border-card-border/60 pt-3">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Action Checklist</span>
                        <div className="space-y-1.5">
                          {phase.actionItems.map((action, aIdx) => {
                            const itemKey = `${pIdx}-${aIdx}`;
                            const isChecked = !!checkedItems[itemKey];
                            return (
                              <label key={aIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => handleCheckChange(pIdx, aIdx, e.target.checked)}
                                  className="mt-0.5 accent-teal-600 rounded cursor-pointer"
                                />
                                <span className={isChecked ? 'line-through text-muted-foreground/60' : 'text-foreground/80 hover:text-foreground'}>
                                  {action}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          ) : (
            /* Empty state */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
              <Map className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
              <h3 className="font-semibold text-sm">No roadmap compiled yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Adjust your profile options on the left and click compile to generate active phase guides.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
